# 🚀 Quick Start - Integração Backend Frontend

## Passo 1: Configurar o Backend

```bash
# Clone/tenha o backend rodando em http://localhost:3000
# O backend deve ter:
# - Express rodando na porta 3000
# - CORS habilitado
# - Rotas /api/auth, /api/sensors, /api/devices, /api/actions, /api/config
```

## Passo 2: Variáveis de Ambiente

Arquivo: `.env.local` (já existe)
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Passo 3: Instalar Dependências

```bash
npm install
# axios já está instalado
```

## Passo 4: Iniciar Frontend

```bash
npm run dev
```

Frontend disponível em: `http://localhost:3000`

---

## ✅ Funcionalidades Integradas

### Dashboard
- ✅ Exibe dados reais de sensores
- ✅ Mostra últimas ações do sistema
- ✅ Auto-refresh a cada 30 segundos

### Temperatura
- ✅ Temperatura e umidade atual
- ✅ Gráfico com histórico
- ✅ Auto-refresh a cada 30 segundos

### Recursos Disponíveis

#### Para Usar em Qualquer Página:

```typescript
// 1. Hook de Sensores (melhor opção)
import { useSensors } from '@/src/hooks/use-sensors';

export function MyPage() {
  const { currentData, historyData, loading, error, fetchHistory } = useSensors();
  
  return (
    <div>
      <p>Temperatura: {currentData?.temperature}°C</p>
      <p>Umidade: {currentData?.humidity}%</p>
    </div>
  );
}
```

```typescript
// 2. Serviço direto (mais controle)
import { sensorsService } from '@/src/lib/api';

useEffect(() => {
  sensorsService.getCurrent().then(data => setData(data));
}, []);
```

```typescript
// 3. Autenticação
import { useAuth } from '@/src/contexts/auth-context';

export function LoginPage() {
  const { login, isLoading, error } = useAuth();
  
  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
      // Usuário autenticado, redirecionar para dashboard
    } catch (err) {
      console.error('Login failed:', err);
    }
  };
}
```

#### Hooks Disponíveis:

- `useSensors()` - Dados de sensores
- `useDevices()` - Gerenciar dispositivos
- `useActions()` - Gerenciar ações
- `useConfig()` - Configurações do sistema
- `useMobile()` - Detectar mobile (existente)

#### Serviços Disponíveis:

```typescript
import {
  authService,
  sensorsService,
  devicesService,
  actionsService,
  configService,
  api // axios configurado
} from '@/src/lib/api';
```

---

## 🔌 Testando a API

### Sensor Atual
```bash
curl http://localhost:3000/api/sensors?limit=1
```

### Histórico de Sensores
```bash
curl http://localhost:3000/api/sensors?limit=10&skip=0
```

### Ações
```bash
curl http://localhost:3000/api/actions
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

---

## 📝 Checklist de Implementação

- [x] Configuração da API
- [x] Interceptor JWT
- [x] Tipos TypeScript
- [x] Dashboard integrado
- [x] Página de Temperatura integrada
- [x] Contexto de Autenticação
- [x] Custom Hooks
- [ ] Página de Água (use TEMPLATE_PAGE_INTEGRATION.tsx)
- [ ] Página de Alimentação (use TEMPLATE_PAGE_INTEGRATION.tsx)
- [ ] Página de Luminosidade (use TEMPLATE_PAGE_INTEGRATION.tsx)
- [ ] Página de Login (usar useAuth)
- [ ] Página de Registro (usar useAuth)

---

## 🐛 Debug

### Verificar Token
```typescript
// No console do navegador
localStorage.getItem('token')
```

### Verificar Status da API
```typescript
// No console
fetch('http://localhost:3000/api/sensors?limit=1')
  .then(r => r.json())
  .then(d => console.log(d))
```

### Logs de Erro
Abrir DevTools (F12) e verificar aba Console para erros

---

## 📚 Estrutura de Dados

### Sensor
```typescript
{
  id?: string;
  temperature: number;
  humidity: number;
  luminosity?: number;
  rationWeight?: number;
  waterLevel?: number;
  createdAt?: string;
  updatedAt?: string;
}
```

### Ação
```typescript
{
  id: string;
  userId: string;
  system: string; // 'water', 'food', 'lighting', etc
  action: string;
  quantity: number;
  user?: { name: string; email: string };
  createdAt?: string;
  updatedAt?: string;
}
```

### Configuração
```typescript
{
  id?: number;
  mode: 'auto' | 'manual';
  lighting?: { enabled: boolean; schedule?: { on: string; off: string } };
  fan?: { enabled: boolean; temperature?: { on: number; off: number } };
  feeder?: { enabled: boolean; weight?: { min: number; max: number } };
  waterPump?: { enabled: boolean };
  createdAt?: string;
  updatedAt?: string;
}
```

---

## 🆘 Problemas Comuns

### Backend não responde
```bash
# Verificar se está rodando
curl http://localhost:3000

# Se não funcionar:
# 1. Verifique se está na pasta do backend
# 2. Execute: npm run dev (ou node src/server.js)
# 3. Verifique porta 3000
```

### CORS Error
Backend já tem CORS configurado. Se persistir, adicione em `app.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Token expirado
Faça login novamente - o token será renovado

### Dados não atualizam
Verifique se `useEffect` está sendo executado - procure por console logs

---

## 💡 Dicas

1. Use `useSensors()` em vez de chamar `sensorsService` diretamente
2. Sempre trate estados de loading e erro
3. Use TypeScript para autocomplete
4. Verifique console.log para debug
5. Use o template `TEMPLATE_PAGE_INTEGRATION.tsx` como guia

---

## 📞 Suporte

Todos os componentes integrados têm:
- Loading states
- Error handling
- Auto-refresh
- TypeScript types
- Comentários úteis

Boa integração! 🎉
