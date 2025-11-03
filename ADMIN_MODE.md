# Modo Administrador - ZCleaner

## Como Funciona

O ZCleaner agora está configurado para **sempre solicitar privilégios administrativos** ao iniciar no Windows.

### O que foi configurado:

1. **Manifesto Windows** (`src-tauri/zcleaner.exe.manifest`)
   - Define `requireAdministrator` no nível de execução
   - Quando o usuário clicar no executável, o Windows mostrará o prompt UAC (User Account Control)
   - O app só iniciará após o usuário aprovar

2. **Build Script** (`src-tauri/build.rs`)
   - Embute o manifesto no executável durante a compilação
   - Usa `winres` para adicionar recursos do Windows

3. **Verificação em Runtime** (`src-tauri/src/lib.rs`)
   - Função `is_elevated()` verifica se está rodando como admin
   - Retorna status no resultado da otimização
   - Mostra mensagem apropriada no console

## Como Testar

### 1. Build do Aplicativo
```bash
bun run tauri build
```

### 2. Executar o Build
O executável estará em:
```
src-tauri/target/release/zcleaner.exe
```

Ao clicar nele, você verá o prompt UAC do Windows pedindo permissão de administrador.

### 3. Modo Dev (sem admin)
```bash
bun run tauri dev
```
⚠️ No modo dev, o app NÃO rodará como admin automaticamente. Para testar com admin:
- Abra o terminal como administrador
- Execute `bun run tauri dev` nesse terminal

## Benefícios do Modo Admin

Com privilégios administrativos, a otimização de memória pode:

✅ Limpar working sets de todos os processos do sistema
✅ Esvaziar standby list e modified page list
✅ Acessar caches do sistema protegidos
✅ Limpar arquivos temporários do sistema (C:\Windows\Temp)
✅ Deletar prefetch e dumps de crash
✅ Maior eficiência na liberação de memória

## Sem Modo Admin

Sem privilégios administrativos, o app ainda funciona mas com limitações:

⚠️ Só pode limpar working sets de processos do próprio usuário
⚠️ Não pode acessar pastas do sistema protegidas
⚠️ Operações de otimização têm eficiência reduzida
⚠️ Algumas categorias de arquivos temporários não serão detectadas

## Desabilitar Requisição de Admin

Se quiser que o app rode sem pedir admin, remova ou comente estas linhas:

**src-tauri/build.rs:**
```rust
// Comente todo o bloco #[cfg(target_os = "windows")]
```

**src-tauri/Cargo.toml:**
```toml
# Remova a seção:
# [target.'cfg(windows)'.build-dependencies]
# winres = "0.1"
```

Depois faça rebuild: `bun run tauri build`

## Segurança

O manifesto é assinado durante o build e faz parte do executável. Isso garante:
- O Windows valida a autenticidade do pedido de admin
- Usuários veem claramente que o app precisa de privilégios elevados
- Não há escalação de privilégios oculta
