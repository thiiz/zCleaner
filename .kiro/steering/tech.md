# Technology Stack

## Frontend

- **Framework**: React 19.1.0 with TypeScript 5.8.3
- **Build Tool**: Vite 7.0.4
- **Styling**: Tailwind CSS 4.0 with PostCSS
- **UI Components**: shadcn/ui (New York style) with Radix UI primitives
- **Animations**: Framer Motion 12.23.24
- **Icons**: Lucide React

## Backend

- **Runtime**: Tauri 2 (Rust-based)
- **System Info**: sysinfo crate 0.32
- **Serialization**: serde + serde_json

## Package Manager

**Bun** is used for dependency management and script execution.

## Common Commands

```bash
# Development
bun run dev              # Start Vite dev server (port 1420)
bun run tauri dev        # Start Tauri app in dev mode

# Build
bun run build            # Build frontend (TypeScript + Vite)
bun run tauri build      # Build complete Tauri application

# Preview
bun run preview          # Preview production build
```

## Configuration Files

- `vite.config.ts`: Vite configuration with React plugin and path aliases
- `tsconfig.json`: TypeScript strict mode with path aliases (`@/*` → `./src/*`)
- `components.json`: shadcn/ui configuration (New York style, Zinc base color)
- `src-tauri/tauri.conf.json`: Tauri app configuration (window size, decorations, build commands)
- `src-tauri/Cargo.toml`: Rust dependencies and build configuration

## Development Server

- Frontend runs on `http://localhost:1420`
- HMR on port 1421
- Tauri watches for Rust changes automatically
