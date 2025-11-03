# Design Document - Windows Booster UI

## Overview

Windows Booster é uma aplicação desktop moderna construída com Tauri, React 19, TypeScript e Tailwind CSS 4. A interface segue os princípios de design do Windows 11, com foco em minimalismo, clareza visual e transições suaves. A arquitetura é baseada em componentes React modulares, gerenciamento de estado local com hooks, e uma biblioteca de componentes UI consistente.

O design prioriza:
- **Experiência nativa**: Visual e comportamento similar ao Windows 11
- **Modularidade**: Componentes independentes e reutilizáveis
- **Performance**: Animações otimizadas e renderização eficiente
- **Manutenibilidade**: Código organizado e fácil de expandir

## Architecture

### Component Hierarchy

```
App (Root Component)
├── Header
│   ├── Logo Icon (Zap from lucide-react)
│   └── Title Text
├── Layout Container
│   ├── Sidebar
│   │   ├── Tab Button (Limpeza)
│   │   ├── Tab Button (Desempenho)
│   │   ├── Tab Button (Inicialização)
│   │   ├── Tab Button (Energia)
│   │   └── Tab Button (Sistema)
│   └── Content Area (AnimatePresence wrapper)
│       ├── CleaningTab
│       ├── PerformanceTab
│       ├── StartupTab
│       ├── PowerTab
│       └── SystemTab
```

### State Management

O aplicativo usa React hooks para gerenciamento de estado:

- **useState**: Gerencia a aba ativa atual
- **Tipo do estado**: `'cleaning' | 'performance' | 'startup' | 'power' | 'system'`
- **Estado inicial**: `'cleaning'` (primeira aba)

Não há necessidade de Context API ou bibliotecas externas de estado, pois o estado é simples e local ao componente App.

### Technology Stack

**Core:**
- React 19.1.0 (já instalado)
- TypeScript 5.8.3 (já instalado)
- Tailwind CSS 4.0.0 (já instalado)
- Vite 7.0.4 (já instalado)

**Novas dependências necessárias:**
- `framer-motion`: ^11.x - Animações de transição entre abas
- `lucide-react`: ^0.x - Biblioteca de ícones moderna
- `class-variance-authority`: ^0.x - Utilitário para variantes de componentes
- `clsx`: ^2.x - Utilitário para classes condicionais
- `tailwind-merge`: ^2.x - Merge inteligente de classes Tailwind

**shadcn/ui:**
- Não é uma dependência npm tradicional
- Componentes são copiados diretamente para o projeto
- Componentes necessários: Button, Card
- Configuração via CLI: `npx shadcn@latest init`

## Components and Interfaces

### 1. App Component (App.tsx)

**Responsabilidade**: Componente raiz que gerencia o layout principal e o estado da aba ativa.

**Props**: Nenhuma

**State**:
```typescript
type TabType = 'cleaning' | 'performance' | 'startup' | 'power' | 'system';
const [activeTab, setActiveTab] = useState<TabType>('cleaning');
```

**Estrutura**:
```tsx
<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
  <Header />
  <div className="flex h-[calc(100vh-80px)]">
    <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
    <main className="flex-1 p-6 overflow-y-auto">
      <AnimatePresence mode="wait">
        {/* Renderização condicional das abas */}
      </AnimatePresence>
    </main>
  </div>
</div>
```

### 2. Header Component

**Responsabilidade**: Exibe o cabeçalho fixo com logo e título.

**Props**: Nenhuma

**Estrutura**:
```tsx
<header className="h-20 bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 flex items-center px-6">
  <Zap className="w-8 h-8 text-blue-500" />
  <h1 className="text-2xl font-semibold text-white ml-3">Windows Booster</h1>
</header>
```

**Estilo**:
- Altura fixa de 80px
- Fundo semi-transparente com blur
- Borda inferior sutil
- Ícone azul (cor de destaque do Windows 11)

### 3. Sidebar Component

**Responsabilidade**: Navegação vertical com abas.

**Props**:
```typescript
interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}
```

**Estrutura**:
```tsx
<aside className="w-64 bg-gray-800/50 backdrop-blur-sm border-r border-gray-700/50 p-4">
  <nav className="space-y-2">
    {tabs.map(tab => (
      <TabButton
        key={tab.id}
        icon={tab.icon}
        label={tab.label}
        active={activeTab === tab.id}
        onClick={() => onTabChange(tab.id)}
      />
    ))}
  </nav>
</aside>
```

**Tabs Configuration**:
```typescript
const tabs = [
  { id: 'cleaning', label: 'Limpeza', icon: Trash2 },
  { id: 'performance', label: 'Desempenho', icon: Gauge },
  { id: 'startup', label: 'Inicialização', icon: Settings },
  { id: 'power', label: 'Energia', icon: Battery },
  { id: 'system', label: 'Sistema', icon: Cpu }
];
```

### 4. TabButton Component

**Responsabilidade**: Botão individual de navegação na sidebar.

**Props**:
```typescript
interface TabButtonProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
}
```

**Estrutura**:
```tsx
<button
  onClick={onClick}
  className={cn(
    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150",
    active
      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50"
      : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
  )}
>
  <Icon className="w-5 h-5" />
  <span className="font-medium">{label}</span>
</button>
```

**Estados visuais**:
- **Ativo**: Fundo azul, texto branco, sombra brilhante
- **Inativo**: Texto cinza, hover com fundo cinza escuro
- **Hover**: Transição suave de 150ms

### 5. Tab Content Components

Cada aba tem seu próprio componente com estrutura similar:

**CleaningTab.tsx**:
```typescript
export default function CleaningTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold text-white">Limpeza do Sistema</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cards com funcionalidades */}
      </div>
    </motion.div>
  );
}
```

**Animação Framer Motion**:
- **Initial**: Opacidade 0, deslocamento vertical +20px
- **Animate**: Opacidade 1, posição normal
- **Exit**: Opacidade 0, deslocamento vertical -20px
- **Duration**: 300ms

**Layout dos Cards**:
- Grid responsivo: 1 coluna em mobile, 2 colunas em desktop
- Gap de 24px entre cards
- Cada card contém título, descrição e botões de ação

### 6. Card Component (shadcn/ui)

**Estrutura base**:
```tsx
<Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
  <CardHeader>
    <CardTitle className="flex items-center gap-2 text-white">
      <Icon className="w-5 h-5 text-blue-500" />
      Título do Card
    </CardTitle>
    <CardDescription className="text-gray-400">
      Descrição da funcionalidade
    </CardDescription>
  </CardHeader>
  <CardContent>
    {/* Conteúdo específico */}
  </CardContent>
  <CardFooter>
    <Button>Ação Principal</Button>
  </CardFooter>
</Card>
```

**Estilo**:
- Fundo semi-transparente com blur
- Bordas sutis em cinza escuro
- Padding consistente
- Hierarquia visual clara

### 7. Button Component (shadcn/ui)

**Variantes**:
```typescript
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-700 text-white hover:bg-gray-600",
        outline: "border border-gray-600 text-gray-300 hover:bg-gray-700"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-sm",
        lg: "h-12 px-6"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
```

## Data Models

### Tab Configuration

```typescript
interface Tab {
  id: TabType;
  label: string;
  icon: LucideIcon;
}

type TabType = 'cleaning' | 'performance' | 'startup' | 'power' | 'system';
```

### Card Content (Placeholder)

```typescript
interface CardContent {
  title: string;
  description: string;
  icon: LucideIcon;
  action: string;
  stats?: {
    label: string;
    value: string;
  }[];
}
```

## Styling System

### Color Palette

**Background Gradients**:
- Primary: `from-gray-900 via-gray-800 to-gray-900`
- Card backgrounds: `bg-gray-800/50` com `backdrop-blur-sm`

**Text Colors**:
- Primary: `text-white`
- Secondary: `text-gray-300`
- Muted: `text-gray-400`
- Accent: `text-blue-500`

**Interactive Elements**:
- Primary action: `bg-blue-600 hover:bg-blue-700`
- Secondary action: `bg-gray-700 hover:bg-gray-600`
- Active state: `bg-blue-600` com `shadow-lg shadow-blue-500/50`

### Spacing System

- Container padding: `p-6`
- Card gap: `gap-6`
- Element spacing: `space-y-4` ou `space-y-6`
- Button padding: `px-4 py-3`

### Border Radius

- Cards: `rounded-xl` (12px)
- Buttons: `rounded-lg` (8px)
- Small elements: `rounded-md` (6px)

### Shadows

- Cards: `shadow-xl`
- Active buttons: `shadow-lg shadow-blue-500/50`
- Hover states: `shadow-md`

## Content Structure per Tab

### CleaningTab

**Cards**:
1. **Arquivos Temporários**
   - Ícone: Trash2
   - Descrição: Limpar cache e arquivos temporários
   - Ação: "Limpar Agora"
   - Stats: "2.4 GB disponíveis para limpeza"

2. **Lixeira**
   - Ícone: Trash
   - Descrição: Esvaziar lixeira do sistema
   - Ação: "Esvaziar"
   - Stats: "156 MB na lixeira"

3. **Downloads Antigos**
   - Ícone: FolderOpen
   - Descrição: Remover arquivos de download antigos
   - Ação: "Analisar"

### PerformanceTab

**Cards**:
1. **Otimização de RAM**
   - Ícone: MemoryStick
   - Descrição: Liberar memória não utilizada
   - Ação: "Otimizar"
   - Stats: "8.2 GB / 16 GB em uso"

2. **Processos em Segundo Plano**
   - Ícone: Activity
   - Descrição: Gerenciar processos desnecessários
   - Ação: "Ver Processos"
   - Stats: "47 processos ativos"

3. **Cache de Sistema**
   - Ícone: Database
   - Descrição: Limpar cache do sistema
   - Ação: "Limpar Cache"

### StartupTab

**Cards**:
1. **Programas de Inicialização**
   - Ícone: Power
   - Descrição: Gerenciar apps que iniciam com o Windows
   - Ação: "Gerenciar"
   - Stats: "12 programas habilitados"

2. **Tempo de Inicialização**
   - Ícone: Clock
   - Descrição: Análise do tempo de boot
   - Stats: "Último boot: 28 segundos"

### PowerTab

**Cards**:
1. **Plano de Energia**
   - Ícone: Zap
   - Descrição: Configurar perfil de energia
   - Ação: "Alterar Plano"
   - Stats: "Plano atual: Balanceado"

2. **Economia de Bateria**
   - Ícone: BatteryCharging
   - Descrição: Ativar modo de economia
   - Ação: "Ativar"

### SystemTab

**Cards**:
1. **Informações do Sistema**
   - Ícone: Monitor
   - Descrição: Detalhes do hardware e SO
   - Stats: 
     - "CPU: Intel Core i7"
     - "RAM: 16 GB"
     - "SO: Windows 11 Pro"

2. **Saúde do Disco**
   - Ícone: HardDrive
   - Descrição: Status dos discos
   - Stats: "SSD: Saudável (512 GB)"

## Error Handling

### Component Error Boundaries

Implementar error boundary no App.tsx para capturar erros de renderização:

```typescript
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### Fallback UI

Exibir mensagem amigável em caso de erro:
- Ícone de alerta
- Mensagem: "Algo deu errado"
- Botão para recarregar a aplicação

## Testing Strategy

### Component Testing

**Ferramentas**: Vitest + React Testing Library

**Testes prioritários**:

1. **App.tsx**:
   - Renderiza header corretamente
   - Renderiza sidebar com todas as abas
   - Troca de aba atualiza o conteúdo
   - Estado inicial é 'cleaning'

2. **Sidebar**:
   - Renderiza todos os botões de aba
   - Callback onTabChange é chamado ao clicar
   - Aba ativa tem estilo correto

3. **TabButton**:
   - Renderiza ícone e label
   - Aplica classe 'active' quando ativo
   - Chama onClick ao ser clicado

4. **Tab Components**:
   - Renderiza título correto
   - Renderiza cards esperados
   - Animação de entrada funciona

### Visual Testing

**Checklist manual**:
- [ ] Gradiente de fundo renderiza suavemente
- [ ] Transições entre abas são fluidas (300ms)
- [ ] Hover states funcionam em todos os botões
- [ ] Cards têm espaçamento consistente
- [ ] Responsividade funciona em 800px-1920px
- [ ] Ícones estão alinhados corretamente
- [ ] Texto é legível em todos os fundos

### Accessibility Testing

- Navegação por teclado (Tab, Enter, Space)
- Contraste de cores WCAG AA
- Labels semânticos em botões
- Estrutura HTML semântica (header, nav, main)

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**: Não necessário inicialmente (componentes pequenos)
2. **Memoization**: Usar React.memo em TabButton se houver re-renders desnecessários
3. **Animation Performance**: Framer Motion usa GPU acceleration automaticamente
4. **Bundle Size**: Importar apenas ícones necessários do lucide-react

### Metrics

- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 2s
- **Bundle size**: < 500KB (gzipped)
- **Animation frame rate**: 60fps

## Implementation Notes

### Setup Steps

1. Instalar dependências:
```bash
npm install framer-motion lucide-react class-variance-authority clsx tailwind-merge
```

2. Inicializar shadcn/ui:
```bash
npx shadcn@latest init
```

3. Adicionar componentes shadcn:
```bash
npx shadcn@latest add button card
```

4. Criar estrutura de pastas:
```
src/
├── components/
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── TabButton.tsx
│   └── ui/ (shadcn components)
├── tabs/
│   ├── CleaningTab.tsx
│   ├── PerformanceTab.tsx
│   ├── StartupTab.tsx
│   ├── PowerTab.tsx
│   └── SystemTab.tsx
├── lib/
│   └── utils.ts (cn helper)
└── App.tsx
```

### Development Order

1. Configurar shadcn/ui e utilitários
2. Criar componentes base (Header, Sidebar, TabButton)
3. Implementar App.tsx com estado e layout
4. Criar componentes de aba com conteúdo placeholder
5. Adicionar animações Framer Motion
6. Refinar estilos e responsividade
7. Testar interatividade e transições

### Tailwind Configuration

Garantir que o Tailwind 4 está configurado corretamente:

```typescript
// vite.config.ts
import tailwindcss from '@tailwindcss/vite';

export default {
  plugins: [
    react(),
    tailwindcss()
  ]
}
```

### TypeScript Configuration

Tipos necessários para lucide-react:

```typescript
import type { LucideIcon } from 'lucide-react';
```

## Future Enhancements

Funcionalidades que podem ser adicionadas posteriormente:

1. **Persistência de estado**: Salvar aba ativa no localStorage
2. **Temas**: Modo claro/escuro alternável
3. **Animações avançadas**: Transições de página mais elaboradas
4. **Notificações**: Toast messages para ações do usuário
5. **Integração Tauri**: Conectar botões a comandos Rust reais
6. **Gráficos**: Visualizações de uso de recursos
7. **Configurações**: Página de preferências do usuário
8. **Atalhos de teclado**: Navegação rápida entre abas
