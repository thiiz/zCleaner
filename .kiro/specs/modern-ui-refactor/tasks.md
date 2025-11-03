# Implementation Plan

- [x] 1. Criar sistema de design tokens e estilos base





  - Criar arquivo src/styles/design-tokens.css com todas as variáveis CSS (cores, espaçamentos, raios, transições, sombras, tipografia)
  - Criar arquivo src/styles/animations.css com animações reutilizáveis (hover, scale, fade, slide, pulse)
  - Atualizar src/App.css para importar os novos arquivos de estilos
  - Atualizar src/main.tsx para importar design-tokens.css e animations.css
  - _Requirements: 1.1, 1.2, 1.3, 1.4_


- [x] 2. Criar componente InteractiveCard aprimorado




  - Criar src/components/enhanced/InteractiveCard.tsx com interface InteractiveCardProps
  - Implementar animações de hover usando Framer Motion (translateY, border color, shadow)
  - Implementar animação de click/tap (scale 0.98)
  - Adicionar suporte para estados disabled e onClick handler
  - Aplicar estilos com design tokens (background #141414, border #1f1f1f, hover #2a2a2a)
  - _Requirements: 2.1, 2.2, 2.3, 5.1, 5.2, 5.3_


- [x] 3. Criar componente AnimatedButton aprimorado




  - Criar src/components/enhanced/AnimatedButton.tsx com interface AnimatedButtonProps
  - Implementar variantes (primary, secondary, outline, ghost) usando class-variance-authority
  - Implementar tamanhos (sm, md, lg) com padding e font-size apropriados
  - Adicionar estado de loading com spinner animado usando Framer Motion
  - Implementar animações de hover (brightness increase) e click (scale)
  - Adicionar suporte para ícones à esquerda do texto
  - Aplicar estilos de disabled (opacity 50%, cursor not-allowed)
  - _Requirements: 2.2, 2.3, 4.3, 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 4. Criar componente StatDisplay para estatísticas





  - Criar src/components/enhanced/StatDisplay.tsx com interface StatDisplayProps
  - Implementar exibição de label, value e unit opcional
  - Adicionar suporte para tipografia monospace em números
  - Implementar tamanhos responsivos (sm, md, lg)
  - Adicionar indicadores de trend opcionais (up, down, neutral) com ícones e cores
  - Aplicar hierarquia visual (label #737373, value #e5e5e5, font-weight 600)
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 5. Criar componente LoadingState unificado





  - Criar src/components/enhanced/LoadingState.tsx com interface LoadingStateProps
  - Implementar variante spinner com animação de rotação contínua usando Framer Motion
  - Implementar variante skeleton com pulse animation
  - Implementar variante progress com barra de progresso
  - Adicionar suporte para mensagem opcional abaixo do loading indicator
  - Implementar tamanhos (sm, md, lg) para cada variante
  - _Requirements: 4.1, 4.2_

- [x] 6. Atualizar componente Sidebar com melhorias visuais




  - Atualizar src/components/Sidebar.tsx para usar design tokens
  - Atualizar src/components/TabButton.tsx com animação de hover (background #1a1a1a, transition 150ms)
  - Adicionar indicador visual de item ativo (border-left 3px solid #f5f5f5, background #1f1f1f)
  - Ajustar cores de ícone e texto para estado ativo (#f5f5f5) e inativo (#737373)
  - Otimizar espaçamento entre ícone e label (gap de 12px)
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
-

- [x] 7. Atualizar componente Header com design aprimorado




  - Atualizar src/components/Header.tsx para usar design tokens
  - Ajustar espaçamento e padding usando variáveis CSS
  - Melhorar hierarquia visual do título e ícone
  - Adicionar transição suave no ícone ao hover
  - _Requirements: 1.3, 1.4_

- [x] 8. Atualizar componente TitleBar com melhorias visuais




  - Atualizar src/components/TitleBar.tsx para usar design tokens
  - Melhorar animações de hover nos botões (transition 200ms)
  - Ajustar cores de hover (minimize/maximize: #1a1a1a, close: red-500/10)
  - Garantir consistência visual com resto da aplicação
  - _Requirements: 2.2_

- [x] 9. Atualizar Dialog/Modal com animações aprimoradas





  - Atualizar src/components/ui/dialog.tsx para adicionar animações de entrada/saída
  - Implementar scale-in animation (95% → 100%, opacity 0 → 1, duration 250ms)
  - Implementar scale-out animation (100% → 95%, opacity 1 → 0, duration 200ms)
  - Adicionar backdrop blur (4px) e animação de opacity (0 → 0.8, duration 200ms)
  - Usar Framer Motion para transições suaves
  - _Requirements: 3.3, 3.4_


- [x] 10. Refatorar CleaningTab com novos componentes







  - Atualizar src/tabs/CleaningTab.tsx para usar InteractiveCard ao invés de Card padrão
  - Substituir Button por AnimatedButton em todos os botões
  - Usar LoadingState para estados de scanning e deleting
  - Usar StatDisplay para exibir tamanhos de arquivo e estatísticas
  - Adicionar animações de transição de página usando pageVariants do Framer Motion
  - Melhorar feedback visual durante operações (progress, success, error states)
  - Aplicar design tokens em todos os estilos inline
  - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 5.4, 5.5, 8.1, 8.2_

- [x] 11. Adicionar micro-interações em checkboxes e accordions






  - Atualizar src/components/ui/checkbox.tsx com animação de bounce (duration 300ms)
  - Adicionar animação de check mark usando Framer Motion
  - Implementar rotação de chevron em accordions (90 graus, duration 200ms)
  - Adicionar hover effect em itens de lista (background #0f0f0f, transition 150ms)
  - _Requirements: 2.5, 9.1, 9.2, 9.3_


- [x] 12. Implementar responsividade e grid adaptativo




  - Atualizar CleaningTab para usar grid responsivo (1 coluna < 1024px, 2 colunas >= 1024px, 3 colunas >= 1440px)
  - Ajustar padding responsivo (24px mobile, 32px desktop) em todos os tabs
  - Adicionar transições suaves ao redimensionar (duration 200ms)
  - Testar em diferentes resoluções (1024px, 1280px, 1440px)
  - Ajustar largura da sidebar responsivamente (200px < 1024px, 240px >= 1024px)
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_


- [x] 13. Implementar suporte a prefers-reduced-motion





  - Criar hook src/hooks/useReducedMotion.ts para detectar preferência do usuário
  - Atualizar todos os componentes animados para respeitar prefers-reduced-motion
  - Criar variantes de animação com duration 0 quando reduced motion está ativo
  - Aplicar em InteractiveCard, AnimatedButton, Dialog, e transições de página
  - _Requirements: Error Handling - Graceful Degradation_

-

- [x] 14. Adicionar estados de erro visuais




  - Criar componente src/components/enhanced/ErrorState.tsx para exibir erros
  - Implementar shake animation para erros de validação (translateX -4px → 4px → 0, duration 400ms)
  - Criar toast notification component para erros de operação
  - Adicionar slide-in animation da direita para toasts
  - Implementar auto-dismiss após 5 segundos
  - Adicionar retry button com hover animation em error states
  - _Requirements: 4.5, Error Handling - Visual Error States_

- [x] 15. Otimizar performance e acessibilidade





  - Adicionar ARIA labels em todos os botões de ícone
  - Implementar focus indicators visíveis (outline 2px solid #f5f5f5)
  - Garantir que todos os elementos interativos são acessíveis via Tab
  - Verificar contraste de cores (mínimo 4.5:1 WCAG AA)
  - Otimizar animações para 60fps usando transform e opacity
  - Adicionar will-change em elementos animados para melhor performance
  - _Requirements: Testing Strategy - Accessibility Testing_




- [ ] 16. Atualizar PerformanceTab com novos componentes


  - Aplicar InteractiveCard, AnimatedButton, StatDisplay e LoadingState
  - Adicionar animações de transição de página




  - Usar design tokens para cores e espaçamentos
  - Manter consistência visual com CleaningTab
  - _Requirements: 3.1, 3.2, 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 17. Atualizar StartupTab com novos componentes






  - Aplicar InteractiveCard, AnimatedButton, StatDisplay e LoadingState
  - Adicionar animações de transição de página
  - Usar design tokens para cores e espaçamentos




  - Manter consistência visual com outros tabs
  - _Requirements: 3.1, 3.2, 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 18. Atualizar PowerTab com novos componentes






  - Aplicar InteractiveCard, AnimatedButton, StatDisplay e LoadingState
  - Adicionar animações de transição de página
  - Usar design tokens para cores e espaçamentos
  - Manter consistência visual com outros tabs
  - _Requirements: 3.1, 3.2, 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 19. Atualizar SystemTab com novos componentes


  - Aplicar InteractiveCard, AnimatedButton, StatDisplay e LoadingState
  - Adicionar animações de transição de página
  - Usar design tokens para cores e espaçamentos
  - Manter consistência visual com outros tabs
  - _Requirements: 3.1, 3.2, 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 20. Criar documentação de componentes e design system


  - Criar src/components/enhanced/README.md documentando todos os novos componentes
  - Adicionar exemplos de uso para cada componente
  - Documentar props e variantes disponíveis
  - Criar guia de estilo com paleta de cores e espaçamentos
  - Adicionar screenshots dos componentes em diferentes estados
  - _Requirements: Design System Structure_
