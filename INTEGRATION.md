# Guia de Integração Frontend com Backend

## Status de Integração

### ✅ Integrado
- **Dashboard** (`src/app/(dashboard)/page.tsx`) - Conectado com API real
- **Temperatura** (`src/app/(dashboard)/temperature/page.tsx`) - Conectado com API real
- **Gráfico de Temperatura** (`src/app/(dashboard)/temperature/components/temperature-chart.tsx`) - Conectado com API real

### 🔄 Necessita Integração
- **Água** (`src/app/(dashboard)/water/page.tsx`)
- **Alimentação** (`src/app/(dashboard)/food/page.tsx`)
- **Luminosidade** (`src/app/(dashboard)/luminosity/page.tsx`)
- **Autenticação** (login/register pages)

## Arquivo de Configuração da API

O arquivo `src/lib/api.ts` foi completamente reescrito com:

- **Configuração da API**: Base URL configurável via `NEXT_PUBLIC_API_URL`
- **Interceptadores Axios**: Adiciona token JWT automaticamente
- **Tipos TypeScript**: Interfaces para todos os dados
- **Serviços Modularizados**:
  - `authService`: Login, registro, perfil
  - `sensorsService`: Dados de sensores atuais e histórico
  - `devicesService`: CRUD de dispositivos
  - `actionsService`: Listagem e criação de ações
  - `configService`: Configurações do sistema

## Variáveis de Ambiente

`.env.local` deve conter:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Próximos Passos

### 1. Integrar página de Água (`water/page.tsx`)

```typescript
import { sensorsService, actionsService } from '@/src/lib/api';

// No useEffect:
const sensorData = await sensorsService.getCurrent();
const waterLevel = sensorData?.waterLevel ?? 0;

// Para liberar água (exemplo):
await actionsService.create({
  userId: userId,
  system: 'water',
  action: 'Liberação manual',
  quantity: 500
});
```

### 2. Integrar página de Alimentação (`food/page.tsx`)

```typescript
// Similar ao water, mas usando:
const quantity = sensorData?.rationWeight ?? 0;

// Para adicionar ração:
await actionsService.create({
  userId: userId,
  system: 'food',
  action: 'Abastecimento',
  quantity: 50
});
```

### 3. Integrar página de Luminosidade (`luminosity/page.tsx`)

```typescript
// Usar luminosity do sensor:
const luminosity = sensorData?.luminosity ?? 0;

// Para atualizar config:
await configService.update({
  lighting: {
    enabled: true,
    schedule: { on: '06:00', off: '20:00' }
  }
});
```

### 4. Implementar Autenticação

Criar contexto de autenticação ou usar library como:
- `zustand` para gerenciamento de estado
- `next-auth` para autenticação mais robusta

Exemplo simples com localStorage e context:

```typescript
// src/contexts/auth-context.tsx
import { createContext, useContext, useState } from 'react';
import { authService, User } from '@/src/lib/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await authService.login(email, password);
      const userData = await authService.me();
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      await authService.register(data);
      await login(data.email, data.password);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
}
```

## Tratamento de Erros

Todos os componentes já tratam erros com:
- Estados de carregamento
- Mensagens de erro amigáveis
- Fallbacks seguros

## Requisições Pendentes

As páginas agora fazem requisições reais. Certifique-se de:

1. **Backend rodando** em `http://localhost:3000`
2. **CORS ativado** no backend (já está no seu app.js)
3. **Autenticação** para rotas protegidas usando JWT

## Padrões Utilizados

- **React Hooks**: useEffect para dados, useState para estado local
- **Async/Await**: Todas as requisições usam async
- **TypeScript**: Tipos definidos para segurança
- **Error Handling**: Try/catch em todas as operações

## Exemplo de Uso Básico

```typescript
import { sensorsService } from '@/src/lib/api';

export default function MyComponent() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const result = await sensorsService.getCurrent();
        setData(result);
      } catch (err) {
        setError('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;
  
  return <div>{JSON.stringify(data)}</div>;
}
```
