# Project Structure

## Root Organization

```
/                       # Workspace root
├── src/               # React frontend source
├── src-tauri/         # Rust backend source
├── public/            # Static assets
├── dist/              # Frontend build output
└── target/            # Rust build output
```

## Frontend Structure (`src/`)

```
src/
├── main.tsx           # React entry point
├── App.tsx            # Root component with TitleBar and Dashboard
├── App.css            # Global styles and Tailwind imports
├── vite-env.d.ts      # Vite type definitions
├── components/        # Reusable UI components
│   ├── ui/           # shadcn/ui base components
│   ├── TitleBar.tsx  # Custom window title bar
│   ├── Toast.tsx     # Toast notification system
│   └── README.md     # Comprehensive component documentation
├── tabs/             # Main application views
│   └── Dashboard.tsx # Primary dashboard view
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── types/            # TypeScript type definitions
├── styles/           # CSS modules and design tokens
│   ├── design-tokens.css  # CSS variables for colors, spacing, etc.
│   └── animations.css     # Animation definitions
└── __tests__/        # Test files
```

## Backend Structure (`src-tauri/`)

```
src-tauri/
├── src/
│   ├── main.rs       # Tauri entry point
│   └── lib.rs        # Core Rust logic and Tauri commands
├── Cargo.toml        # Rust dependencies
├── tauri.conf.json   # Tauri configuration
├── build.rs          # Build script
├── capabilities/     # Tauri security capabilities
├── icons/            # Application icons
└── target/           # Rust build artifacts
```

## Key Conventions

### Path Aliases

Use `@/` prefix for imports from `src/`:
```typescript
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
```

### Component Organization

- **Base UI components**: `src/components/ui/` (shadcn/ui)
- **Enhanced components**: `src/components/` (custom with animations)
- **Layout components**: `src/components/` (TitleBar, Toast, etc.)
- **View components**: `src/tabs/` (Dashboard, etc.)

### Tauri Commands

Rust functions exposed to frontend are defined in `src-tauri/src/lib.rs`:
- `scan_temp_files()` - Scans system for temporary files
- `delete_temp_files()` - Deletes specified files with progress events
- `get_system_info()` - Returns CPU, memory, OS information
- `get_disk_info()` - Returns disk usage information
- `open_folder_location()` - Opens file location in Explorer

### Design System

All components use centralized design tokens from `src/styles/design-tokens.css`:
- Color variables: `--color-bg-*`, `--color-text-*`, `--color-border-*`
- Spacing: `--spacing-xs` through `--spacing-2xl`
- Transitions: `--transition-fast`, `--transition-base`, etc.

Refer to `src/components/README.md` for complete component documentation and usage examples.
