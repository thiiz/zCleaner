# Error State Components

This document describes the error handling components added to the Windows Booster application.

## Components

### 1. ErrorState

A component for displaying error states with optional retry functionality.

#### Features
- **Shake Animation**: Validation errors trigger a shake animation (translateX -4px → 4px → 0, 400ms)
- **Retry Button**: Optional retry button with hover animation
- **Multiple Sizes**: sm, md, lg variants
- **Error Icon**: Animated pulse effect on the error icon
- **Design Tokens**: Fully integrated with the design system
- **Accessibility**: Respects `prefers-reduced-motion`

#### Usage

```tsx
import { ErrorState } from '@/components/enhanced';

// Basic error with retry
<ErrorState
  title="Operation Failed"
  message="Unable to complete the operation"
  onRetry={handleRetry}
/>

// Validation error with shake animation
<ErrorState
  message="Please enter a valid email address"
  shake
  size="sm"
/>

// Large error without icon
<ErrorState
  title="Server Error"
  message="The server encountered an error"
  size="lg"
  showIcon={false}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"Error"` | Error title |
| `message` | `string` | **required** | Error message |
| `className` | `string` | - | Additional CSS classes |
| `onRetry` | `() => void` | - | Retry callback function |
| `retryText` | `string` | `"Try Again"` | Retry button text |
| `shake` | `boolean` | `false` | Enable shake animation |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant |
| `showIcon` | `boolean` | `true` | Show error icon |

---

### 2. Toast

A notification component that slides in from the right and auto-dismisses.

#### Features
- **Slide-in Animation**: Smooth slide from the right (400px → 0, 300ms)
- **Auto-dismiss**: Configurable duration (default 5 seconds)
- **Multiple Types**: success, error, warning, info
- **Progress Bar**: Visual indicator of remaining time
- **Close Button**: Manual dismiss option
- **Design Tokens**: Fully integrated with the design system
- **Accessibility**: ARIA live regions, respects `prefers-reduced-motion`

#### Usage

```tsx
import { Toast } from '@/components/enhanced';

// Basic toast
<Toast
  type="error"
  message="Operation failed"
/>

// Toast with title and custom duration
<Toast
  type="success"
  title="Success"
  message="Changes saved successfully"
  duration={3000}
/>

// Toast without auto-dismiss
<Toast
  type="warning"
  message="Please review your input"
  duration={0}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | Toast type |
| `title` | `string` | - | Toast title (optional) |
| `message` | `string` | **required** | Toast message |
| `className` | `string` | - | Additional CSS classes |
| `duration` | `number` | `5000` | Auto-dismiss duration (0 to disable) |
| `onDismiss` | `() => void` | - | Callback when dismissed |
| `showClose` | `boolean` | `true` | Show close button |
| `visible` | `boolean` | `true` | Controlled visibility |

---

### 3. ToastProvider & useToast

Context provider and hook for managing toast notifications.

#### Features
- **Multiple Toasts**: Display multiple toasts simultaneously
- **Queue Management**: Automatically limits number of visible toasts
- **Helper Methods**: Convenient methods for each toast type
- **Positioning**: Configurable toast position
- **Global Access**: Use toasts from anywhere in the app

#### Setup

Wrap your app with `ToastProvider`:

```tsx
import { ToastProvider } from '@/components/enhanced';

function App() {
  return (
    <ToastProvider position="top-right" maxToasts={3}>
      {/* Your app content */}
    </ToastProvider>
  );
}
```

#### Usage

```tsx
import { useToast } from '@/components/enhanced';

function MyComponent() {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success('Operation completed successfully');
  };

  const handleError = () => {
    toast.error('Something went wrong', 'Error');
  };

  const handleWarning = () => {
    toast.warning('Please review your input', 'Warning');
  };

  const handleInfo = () => {
    toast.info('New update available');
  };

  const handleCustom = () => {
    toast.showToast({
      type: 'error',
      title: 'Custom Toast',
      message: 'This is a custom toast',
      duration: 3000,
    });
  };

  return (
    <div>
      <button onClick={handleSuccess}>Success</button>
      <button onClick={handleError}>Error</button>
      <button onClick={handleWarning}>Warning</button>
      <button onClick={handleInfo}>Info</button>
      <button onClick={handleCustom}>Custom</button>
    </div>
  );
}
```

#### ToastProvider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxToasts` | `number` | `5` | Maximum number of toasts |
| `defaultDuration` | `number` | `5000` | Default toast duration (ms) |
| `position` | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left' \| 'top-center' \| 'bottom-center'` | `'top-right'` | Toast position |

#### useToast Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `success` | `(message: string, title?: string) => string` | Show success toast |
| `error` | `(message: string, title?: string) => string` | Show error toast |
| `warning` | `(message: string, title?: string) => string` | Show warning toast |
| `info` | `(message: string, title?: string) => string` | Show info toast |
| `showToast` | `(toast: ToastOptions) => string` | Show custom toast |
| `dismissToast` | `(id: string) => void` | Dismiss specific toast |
| `dismissAll` | `() => void` | Dismiss all toasts |

---

## Integration Examples

### Example 1: Form Validation

```tsx
import { ErrorState } from '@/components/enhanced';
import { useState } from 'react';

function LoginForm() {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation logic
    if (!email) {
      setError('Please enter your email');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" />
      
      {error && (
        <ErrorState
          message={error}
          shake
          size="sm"
        />
      )}
      
      <button type="submit">Login</button>
    </form>
  );
}
```

### Example 2: API Error Handling

```tsx
import { ErrorState } from '@/components/enhanced';
import { useToast } from '@/components/enhanced';
import { useState } from 'react';

function DataFetcher() {
  const toast = useToast();
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      toast.success('Data loaded successfully');
    } catch (err) {
      setError(err as Error);
      toast.error('Failed to load data', 'Error');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <ErrorState
        title="Failed to Load Data"
        message={error.message}
        onRetry={fetchData}
      />
    );
  }

  return (
    <button onClick={fetchData} disabled={loading}>
      {loading ? 'Loading...' : 'Load Data'}
    </button>
  );
}
```

### Example 3: Operation Feedback

```tsx
import { useToast } from '@/components/enhanced';

function FileManager() {
  const toast = useToast();

  const handleDelete = async (fileId: string) => {
    try {
      await deleteFile(fileId);
      toast.success('File deleted successfully');
    } catch (error) {
      toast.error('Failed to delete file', 'Error');
    }
  };

  const handleSave = async (data: any) => {
    try {
      await saveData(data);
      toast.success('Changes saved');
    } catch (error) {
      toast.error('Failed to save changes', 'Save Failed');
    }
  };

  return (
    <div>
      <button onClick={() => handleSave(data)}>Save</button>
      <button onClick={() => handleDelete(fileId)}>Delete</button>
    </div>
  );
}
```

---

## Design Tokens Used

The error components use the following design tokens:

### Colors
- `--color-error`: #ef4444 (error red)
- `--color-success`: #22c55e (success green)
- `--color-warning`: #f59e0b (warning orange)
- `--color-info`: #3b82f6 (info blue)
- `--color-bg-tertiary`: #141414 (background)
- `--color-border-default`: #1f1f1f (border)
- `--color-text-primary`: #e5e5e5 (primary text)
- `--color-text-secondary`: #a3a3a3 (secondary text)

### Transitions
- `--transition-fast`: 150ms
- `--transition-base`: 200ms
- `--transition-slow`: 300ms
- `--transition-slower`: 400ms

### Spacing
- `--spacing-xs`: 8px
- `--spacing-sm`: 12px
- `--spacing-md`: 16px
- `--spacing-lg`: 24px

### Z-Index
- `--z-tooltip`: 1600 (toasts appear above everything)

---

## Accessibility

All error components follow accessibility best practices:

1. **ARIA Labels**: Proper ARIA attributes for screen readers
2. **Live Regions**: Toasts use `aria-live="polite"` for announcements
3. **Keyboard Navigation**: All interactive elements are keyboard accessible
4. **Focus Management**: Visible focus indicators on interactive elements
5. **Reduced Motion**: Respects `prefers-reduced-motion` user preference
6. **Color Contrast**: All text meets WCAG AA standards (4.5:1 minimum)

---

## Animation Details

### ErrorState Shake Animation
- **Keyframes**: translateX(-4px → 4px → -4px → 4px → -2px → 2px → 0)
- **Duration**: 400ms
- **Easing**: ease-in-out
- **Trigger**: When `shake` prop is true

### Toast Slide-in Animation
- **Entry**: translateX(400px → 0), opacity(0 → 1)
- **Duration**: 300ms
- **Easing**: cubic-bezier(0.4, 0, 0.2, 1)
- **Exit**: translateX(0 → 400px), opacity(1 → 0)
- **Duration**: 200ms

### Icon Pulse Animation
- **Keyframes**: scale(1 → 1.1 → 1), opacity(1 → 0.8 → 1)
- **Duration**: 2s
- **Repeat**: Infinite
- **Easing**: ease-in-out

---

## Requirements Satisfied

This implementation satisfies the following requirements from the design document:

- **Requirement 4.5**: Visual error states with clear feedback
- **Error Handling - Visual Error States**: 
  - Shake animation for validation errors
  - Toast notifications for operation errors
  - Retry buttons with hover animations
  - Auto-dismiss functionality
  - Slide-in animations from the right

---

## Testing

To test the error components:

1. **Visual Testing**: Check all variants and states
2. **Animation Testing**: Verify smooth animations at 60fps
3. **Accessibility Testing**: Test with keyboard and screen readers
4. **Reduced Motion**: Test with `prefers-reduced-motion` enabled
5. **Integration Testing**: Test in real application scenarios

See `ErrorStateExample.tsx` for comprehensive usage examples.
