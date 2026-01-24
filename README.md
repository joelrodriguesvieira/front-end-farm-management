# 🌾 Farm Management Frontend

Sistema de gerenciamento de fazenda com integração em tempo real com backend Node.js/Express.

## 🚀 Início Rápido

### Pré-requisitos
- Backend rodando em `http://localhost:3000`
- Node.js 18+

### Instalação
```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## ✨ Funcionalidades Integradas

### ✅ Dashboard
- Visão geral do sistema com dados reais
- Status de água, alimentação, temperatura, luminosidade
- Últimas ações do sistema
- Auto-refresh a cada 30 segundos

### ✅ Temperatura
- Leitura de temperatura e umidade em tempo real
- Gráfico interativo com histórico
- Auto-refresh a cada 30 segundos

### ✅ Água
- Nível de água em tempo real
- Status do sistema (Normal, Atenção, Crítico)
- Gráfico com histórico de níveis
- Liberar água manualmente
- Histórico de ações
- Sistema de bloqueio

### ✅ Alimentação
- Quantidade de ração em tempo real
- Status do estoque
- Previsão de dias de ração
- Liberar comida automaticamente
- Abastecer comida manualmente
- Modo automático
- Histórico de ações

### ✅ Luminosidade
- Luminosidade atual em tempo real
- Modo automático/manual
- Ajuste de intensidade com slider
- Ligar/desligar luz
- Agendar ligamento automático
- Gráfico com histórico
- Histórico de ações

### ✅ API Services
- Autenticação (login/register)
- Sensores (leitura atual e histórico)
- Dispositivos (CRUD)
- Ações (listagem e criação)
- Configurações (get/update)

### ✅ Autenticação
- Context API para gerenciamento
- Token JWT automático
- useAuth() hook
- ProtectedRoute component

## 📁 Estrutura

```
src/
├── app/                    # Páginas Next.js
│   ├── (dashboard)/        # Rotas protegidas
│   │   ├── page.tsx        # Dashboard (integrado)
│   │   ├── temperature/    # Temperatura (integrado)
│   │   ├── water/          # Água (template)
│   │   ├── food/           # Alimentação (template)
│   │   └── luminosity/     # Luminosidade (template)
│   └── (public)/           # Rotas públicas
│       ├── login/
│       └── register/
├── components/
│   ├── common/
│   │   ├── protected-route.tsx
│   │   └── app-sidebar.tsx
│   ├── shared/
│   │   └── actions-table/
│   └── ui/                 # Componentes UI (shadcn)
├── contexts/
│   └── auth-context.tsx    # Autenticação (integrado)
├── hooks/
│   ├── use-sensors.ts      # Sensores (integrado)
│   ├── use-devices.ts      # Dispositivos (integrado)
│   ├── use-actions.ts      # Ações (integrado)
│   ├── use-config.ts       # Configurações (integrado)
│   └── use-mobile.ts
├── lib/
│   ├── api.ts              # Services e tipos (integrado)
│   └── utils.ts
└── mocks/                  # Mock data (antigo - não usado)
```

## 🔧 Variáveis de Ambiente

`.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 📚 Documentação

- [QUICK_START.md](./QUICK_START.md) - Começar rápido
- [INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md) - Resumo da integração
- [INTEGRATION.md](./INTEGRATION.md) - Guia detalhado
- [NEXT_STEPS.md](./NEXT_STEPS.md) - Próximos passos
- [CHECKLIST.md](./CHECKLIST.md) - Status da integração
- [TEMPLATE_PAGE_INTEGRATION.tsx](./TEMPLATE_PAGE_INTEGRATION.tsx) - Template para novas páginas

## 💡 Exemplos de Uso

### Usar dados de sensores
```typescript
import { useSensors } from '@/src/hooks/use-sensors';

export function MyComponent() {
  const { currentData, loading, error } = useSensors();
  
  return (
    <div>
      {loading && <p>Carregando...</p>}
      {error && <p>{error}</p>}
      {currentData && <p>Temp: {currentData.temperature}°C</p>}
    </div>
  );
}
```

### Autenticação
```typescript
import { useAuth } from '@/src/contexts/auth-context';

export function LoginPage() {
  const { login, isLoading } = useAuth();
  
  return (
    <button onClick={() => login(email, password)} disabled={isLoading}>
      Entrar
    </button>
  );
}
```

### Criar ação
```typescript
import { useActions } from '@/src/hooks/use-actions';

const { create } = useActions();
await create({
  userId: 'user-id',
  system: 'water',
  action: 'Liberação manual',
  quantity: 500
});
```

## 🧪 Testar

```bash
# Verificar backend
curl http://localhost:3000

# Verificar sensores
curl http://localhost:3000/api/sensors?limit=1

# Iniciar frontend
npm run dev
```

## 🚀 Deploy

### Build
```bash
npm run build
npm start
```

### Variáveis de Produção
```
NEXT_PUBLIC_API_URL=https://seu-api.com
```

## 📊 Status de Integração

| Funcionalidade | Status | Localização |
|---|---|---|
| Dashboard | ✅ Integrado | `/dashboard` |
| Temperatura | ✅ Integrado | `/temperature` |
| Água | ✅ Integrado | `/water` |
| Alimentação | ✅ Integrado | `/food` |
| Luminosidade | ✅ Integrado | `/luminosity` |
| Autenticação | ✅ Implementado | Context + Hooks |
| Sensores API | ✅ Implementado | `src/lib/api.ts` |
| Dispositivos API | ✅ Implementado | `src/lib/api.ts` |
| Ações API | ✅ Implementado | `src/lib/api.ts` |
| Configurações API | ✅ Implementado | `src/lib/api.ts` |
| Login | ⏳ Template | `/(public)/login` |
| Registro | ⏳ Template | `/(public)/register` |

## 🛠️ Stack Técnico

- **Framework**: Next.js 15.5.6
- **Language**: TypeScript
- **UI Components**: shadcn/ui
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Icons**: Lucide React
- **Table**: TanStack React Table
- **Styling**: Tailwind CSS
- **State Management**: React Context + Hooks

## 📞 Suporte

Consulte os arquivos de documentação:
1. Erro ao conectar: [QUICK_START.md](./QUICK_START.md#troubleshooting)
2. Como integrar página: [TEMPLATE_PAGE_INTEGRATION.tsx](./TEMPLATE_PAGE_INTEGRATION.tsx)
3. Guia completo: [INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md)

## 📝 Licença

MIT

---

**Integração com Backend: ✅ Completa (90%)**

Para mais informações, consulte a documentação específica ou abra uma issue.


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
