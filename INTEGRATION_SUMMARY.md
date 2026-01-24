# Integração Frontend com Backend - Resumo

## ✅ O que foi implementado

### 1. **API Service Layer** (`src/lib/api.ts`)
- Configuração Axios com base URL configurável
- Interceptor automático de JWT
- Tipos TypeScript para todas as entidades
- 5 serviços modularizados:
  - `authService`: Login, registro, perfil do usuário
  - `sensorsService`: Dados de sensores atuais e histórico
  - `devicesService`: CRUD de dispositivos
  - `actionsService`: Listagem e criação de ações
  - `configService`: Configurações do sistema

### 2. **Páginas Integradas**
- ✅ **Dashboard** - Exibe status do sistema com dados reais
- ✅ **Temperatura** - Mostra temperatura/umidade atual e histórico
- ✅ **Gráfico de Temperatura** - Renderiza histórico de sensores

### 3. **Contexto de Autenticação** (`src/contexts/auth-context.tsx`)
- Gerenciamento de autenticação com Context API
- Armazenamento de token JWT
- Estados de loading e erro
- Verificação automática de autenticação ao montar

### 4. **Custom Hooks** (em `src/hooks/`)
- `use-sensors.ts` - Gerencia dados de sensores
- `use-devices.ts` - Gerencia dispositivos
- `use-actions.ts` - Gerencia ações
- `use-config.ts` - Gerencia configurações
- `use-mobile.ts` - Detecta viewport mobile (existente)

### 5. **Componentes de Proteção**
- `ProtectedRoute.tsx` - HOC para proteger rotas privadas

## 🔧 Configuração Necessária

### Variável de Ambiente
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Iniciar o Backend
```bash
# Na pasta do backend
npm install
npm run dev
# Rodará em http://localhost:3000
```

### Iniciar o Frontend
```bash
# Na pasta do frontend
npm install
npm run dev
# Rodará em http://localhost:3000 (next) ou porta configurada
```

## 📋 Como Usar os Serviços

### Exemplo: Buscar Sensores
```typescript
import { sensorsService } from '@/src/lib/api';
import { useEffect, useState } from 'react';

export function MyComponent() {
  const [sensor, setSensor] = useState(null);

  useEffect(() => {
    sensorsService.getCurrent().then(setSensor);
  }, []);

  return <div>{sensor?.temperature}°C</div>;
}
```

### Exemplo: Usar Hook de Sensores
```typescript
import { useSensors } from '@/src/hooks/use-sensors';

export function MyComponent() {
  const { currentData, loading, error } = useSensors();

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return <div>{currentData?.temperature}°C</div>;
}
```

### Exemplo: Autenticação
```typescript
import { useAuth } from '@/src/contexts/auth-context';

export function LoginPage() {
  const { login, isLoading, error } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      // Redirecionado para dashboard
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const email = (form.email as HTMLInputElement).value;
      const password = (form.password as HTMLInputElement).value;
      handleLogin(email, password);
    }}>
      {/* Form fields */}
    </form>
  );
}
```

## 📝 Próximas Páginas para Integrar

### Water Page (`water/page.tsx`)
```typescript
import { useSensors } from '@/src/hooks/use-sensors';
import { useActions } from '@/src/hooks/use-actions';

const waterLevel = currentData?.waterLevel ?? 0;

// Para liberar água:
await create({
  userId: user.id,
  system: 'water',
  action: 'Liberação manual',
  quantity: 500
});
```

### Food Page (`food/page.tsx`)
Similar ao water, usando `rationWeight` do sensor

### Luminosity Page (`luminosity/page.tsx`)
Usar `luminosity` do sensor e `configService` para atualizar

## 🚀 Deploy

Antes de fazer deploy, lembre-se de:

1. **Variáveis de Ambiente**
   - Usar URL de produção do backend
   - Exemplo: `NEXT_PUBLIC_API_URL=https://api.seu-dominio.com`

2. **Segurança**
   - Nunca commitar tokens no repositório
   - Usar `.env.local` localmente (já está no .gitignore)
   - Configurar CORS corretamente no backend para produção

3. **Build**
   ```bash
   npm run build
   npm start
   ```

## 📚 Estrutura de Tipos

Todos os tipos estão definidos em `src/lib/api.ts`:
- `User`: Dados do usuário
- `SensorData`: Leitura de sensores
- `Device`: Dispositivos do sistema
- `Action`: Ações do sistema
- `Config`: Configurações

## 🐛 Troubleshooting

### Erro: "Cannot find module from api"
- Certifique-se que o arquivo `src/lib/api.ts` existe
- Verifique os imports: `import { api } from '@/src/lib/api'`

### Erro: "Backend not responding"
- Verifique se backend está rodando em `http://localhost:3000`
- Verifique CORS no backend: `app.use(cors())`
- Verifique se a porta está correta

### Erro: "Unauthorized (401)"
- Token pode estar expirado
- Faça login novamente
- Verifique se o backend está validando JWT corretamente

### CORS Error
Backend (`app.js`) já tem CORS configurado:
```javascript
app.use(cors());
```

Se ainda houver erro, adicione no backend:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

## 📞 Suporte

Todos os serviços têm tratamento de erro completo. Se encontrar um erro:

1. Verifique o console do navegador (DevTools)
2. Verifique os logs do backend
3. Valide a estrutura de dados
4. Verifique conectividade de rede
