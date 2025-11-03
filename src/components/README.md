# Enhanced Components - Modern UI Design System

Comprehensive documentation for the enhanced component library used in the Windows Booster application. This design system provides a consistent, modern, and accessible user interface with smooth animations and interactive states.

## Table of Contents

- [Overview](#overview)
- [Design Tokens](#design-tokens)
- [Components](#components)
  - [InteractiveCard](#interactivecard)
  - [AnimatedButton](#animatedbutton)
  - [StatDisplay](#statdisplay)
  - [LoadingState](#loadingstate)
  - [ErrorState](#errorstate)
- [Style Guide](#style-guide)
- [Accessibility](#accessibility)
- [Performance](#performance)

---

## Overview

The enhanced component library is built on top of React 19, Framer Motion 12, and Tailwind CSS 4. All components follow these principles:

- **Consistent Design**: Uses centralized design tokens for colors, spacing, and typography
- **Smooth Animations**: Leverages Framer Motion for 60fps animations
- **Accessibility First**: WCAG AA compliant with keyboard navigation and screen reader support
- **Reduced Motion Support**: Respects user's `prefers-reduced-motion` preference
- **Type Safe**: Full TypeScript support with comprehensive prop interfaces
- **Performance Optimized**: Uses `will-change` hints and GPU-accelerated transforms

---

## Design Tokens

All components use CSS variables defined in `src/styles/design-tokens.css` for consistent styling.

### Color Palette

#### Background Colors
```css
--color-bg-primary: #0a0a0a      /* Main background */
--color-bg-secondary: #0f0f0f    /* Secondary surfaces */
--color-bg-tertiary: #141414     /* Cards and elevated surfaces */
--color-bg-elevated: #1a1a1a     /* Hover states and dropdowns */
```

#### Border Colors
```css
--color-border-subtle: #1a1a1a   /* Subtle dividers */
--color-border-default: #1f1f1f  /* Default borders */
--color-border-hover: #2a2a2a    /* Hover state borders */
```

#### Text Colors
```css
--color-text-primary: #e5e5e5    /* Primary text (14.7:1 contrast) */
--color-text-secondary: #a3a3a3  /* Secondary text (7.2:1 contrast) */
--color-text-tertiary: #737373   /* Tertiary text (4.6:1 contrast) */
--color-text-disabled: #525252   /* Disabled text */
```

#### Status Colors
```css
--color-success: #22c55e         /* Success states */
--color-error: #ef4444           /* Error states */
--color-warning: #f59e0b         /* Warning states */
--color-info: #3b82f6            /* Info states */
```

### Spacing Scale
```css
--spacing-xs: 8px
--spacing-sm: 12px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 32px
--spacing-2xl: 48px
```

### Border Radius
```css
--radius-sm: 6px
--radius-md: 8px
--radius-lg: 12px
--radius-xl: 16px
```

### Transitions
```css
--transition-fast: 150ms
--transition-base: 200ms
--transition-slow: 300ms
--transition-slower: 400ms
```

---

## Components

### InteractiveCard

A modern card component with smooth hover animations and interactive states.

#### Features
- Hover elevation animation (translateY -2px, 200ms)
- Border color transitions on hover
- Click/tap scale animation (0.98, 100ms)
- Disabled state support
- Keyboard accessible (Tab navigation, Enter/Space activation)
- Respects `prefers-reduced-motion`

#### Props

```typescript
interface InteractiveCardProps {
  children: React.ReactNode;      // Card content
  className?: string;              // Additional CSS classes
  onClick?: () => void;            // Click handler
  disabled?: boolean;              // Disabled state (default: false)
  hoverable?: boolean;             // Enable hover animations (default: true)
}
```

#### Usage Examples

**Basic Card**
```tsx
import { InteractiveCard } from '@/components/enhanced/InteractiveCard';

<InteractiveCard>
  <h3 className="text-lg font-semibold">Card Title</h3>
  <p className="text-sm text-secondary">Card description</p>
</InteractiveCard>
```

**Clickable Card**
```tsx
<InteractiveCard onClick={() => console.log('Card clicked')}>
  <div className="flex items-center gap-3">
    <FileIcon className="h-5 w-5" />
    <span>Click me</span>
  </div>
</InteractiveCard>
```

**Disabled Card**
```tsx
<InteractiveCard disabled>
  <p>This card is disabled</p>
</InteractiveCard>
```

**Non-hoverable Card**
```tsx
<InteractiveCard hoverable={false}>
  <p>Static card without hover effects</p>
</InteractiveCard>
```

#### Visual States

| State | Description | Animation |
|-------|-------------|-----------|
| Default | Base card appearance | None |
| Hover | Elevated with shadow | translateY(-2px), border color change |
| Active | Pressed state | scale(0.98) |
| Disabled | Grayed out, non-interactive | opacity: 0.5 |
| Focus | Keyboard focus indicator | 2px outline ring |

---

### AnimatedButton

A versatile button component with multiple variants, sizes, and loading states.

#### Features
- 4 variants: primary, secondary, outline, ghost
- 3 sizes: sm, md, lg
- Loading state with animated spinner
- Hover brightness increase (110%)
- Click scale animation (0.98)
- Icon support (left of text)
- Disabled state with reduced opacity
- Full keyboard and screen reader support

#### Props

```typescript
interface AnimatedButtonProps {
  children: React.ReactNode;                           // Button text
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';  // Visual style
  size?: 'sm' | 'md' | 'lg';                          // Button size
  loading?: boolean;                                   // Loading state
  disabled?: boolean;                                  // Disabled state
  icon?: React.ReactNode;                             // Icon element
  type?: 'button' | 'submit' | 'reset';               // Button type
  onClick?: () => void;                               // Click handler
  className?: string;                                  // Additional classes
}
```

#### Usage Examples

**Primary Button**
```tsx
import { AnimatedButton } from '@/components/enhanced/AnimatedButton';

<AnimatedButton variant="primary" onClick={handleClick}>
  Save Changes
</AnimatedButton>
```

**Button with Icon**
```tsx
import { Save } from 'lucide-react';

<AnimatedButton variant="primary" icon={<Save className="h-4 w-4" />}>
  Save
</AnimatedButton>
```

**Loading Button**
```tsx
<AnimatedButton variant="primary" loading>
  Saving...
</AnimatedButton>
```

**Different Sizes**
```tsx
<AnimatedButton size="sm">Small</AnimatedButton>
<AnimatedButton size="md">Medium</AnimatedButton>
<AnimatedButton size="lg">Large</AnimatedButton>
```

**All Variants**
```tsx
<AnimatedButton variant="primary">Primary</AnimatedButton>
<AnimatedButton variant="secondary">Secondary</AnimatedButton>
<AnimatedButton variant="outline">Outline</AnimatedButton>
<AnimatedButton variant="ghost">Ghost</AnimatedButton>
```

#### Variant Styles

| Variant | Background | Text | Border | Use Case |
|---------|-----------|------|--------|----------|
| Primary | #f5f5f5 | #0a0a0a | None | Main actions |
| Secondary | #1a1a1a | #e5e5e5 | #1f1f1f | Secondary actions |
| Outline | Transparent | #e5e5e5 | #1f1f1f | Tertiary actions |
| Ghost | Transparent | #e5e5e5 | None | Subtle actions |

#### Size Specifications

| Size | Height | Padding | Font Size | Icon Gap |
|------|--------|---------|-----------|----------|
| sm | 32px | 12px | 12px | 6px |
| md | 40px | 24px | 14px | 8px |
| lg | 48px | 32px | 16px | 10px |

---

### StatDisplay

A component for displaying statistics and numerical data with optional trend indicators.

#### Features
- Monospace font option for numbers
- Trend indicators (up, down, neutral)
- 3 size variants
- Clear visual hierarchy (label → value → unit)
- Responsive sizing

#### Props

```typescript
interface StatDisplayProps {
  label: string;                    // Stat label
  value: string | number;           // Stat value
  unit?: string;                    // Optional unit (e.g., "MB", "%")
  trend?: 'up' | 'down' | 'neutral'; // Trend indicator
  size?: 'sm' | 'md' | 'lg';        // Size variant
  mono?: boolean;                   // Use monospace font (default: true)
  className?: string;               // Additional classes
}
```

#### Usage Examples

**Basic Stat**
```tsx
import { StatDisplay } from '@/components/enhanced/StatDisplay';

<StatDisplay
  label="Total Files"
  value={1234}
/>
```

**Stat with Unit**
```tsx
<StatDisplay
  label="Cache Size"
  value="256.5"
  unit="MB"
/>
```

**Stat with Trend**
```tsx
<StatDisplay
  label="Performance"
  value="85"
  unit="%"
  trend="up"
/>
```

**Different Sizes**
```tsx
<StatDisplay label="Small" value={100} size="sm" />
<StatDisplay label="Medium" value={100} size="md" />
<StatDisplay label="Large" value={100} size="lg" />
```

**Non-monospace**
```tsx
<StatDisplay
  label="User Count"
  value="1,234"
  mono={false}
/>
```

#### Trend Indicators

| Trend | Icon | Color | Use Case |
|-------|------|-------|----------|
| up | ↗ TrendingUp | Green (#22c55e) | Positive increase |
| down | ↘ TrendingDown | Red (#ef4444) | Negative decrease |
| neutral | → Minus | Gray (#a3a3a3) | No change |

---

### LoadingState

A unified loading component with multiple variants for different use cases.

#### Features
- 3 variants: spinner, skeleton, progress
- 3 size options for each variant
- Optional message display
- Smooth animations (respects reduced motion)
- Progress bar with percentage display
- ARIA live regions for accessibility

#### Props

```typescript
interface LoadingStateProps {
  type?: 'spinner' | 'skeleton' | 'progress';  // Loading variant
  size?: 'sm' | 'md' | 'lg';                   // Size variant
  message?: string;                             // Optional message
  progress?: number;                            // Progress value (0-100)
  className?: string;                           // Additional classes
}
```

#### Usage Examples

**Spinner Loading**
```tsx
import { LoadingState } from '@/components/enhanced/LoadingState';

<LoadingState
  type="spinner"
  size="md"
  message="Loading data..."
/>
```

**Skeleton Loading**
```tsx
<LoadingState
  type="skeleton"
  size="lg"
/>
```

**Progress Bar**
```tsx
<LoadingState
  type="progress"
  progress={65}
  message="Processing files..."
/>
```

**Different Sizes**
```tsx
<LoadingState type="spinner" size="sm" />
<LoadingState type="spinner" size="md" />
<LoadingState type="spinner" size="lg" />
```

#### Variant Specifications

| Variant | Animation | Duration | Use Case |
|---------|-----------|----------|----------|
| Spinner | Continuous rotation | 1s | General loading |
| Skeleton | Pulse opacity | 1.5s | Content placeholders |
| Progress | Width transition | 300ms | File operations, downloads |

#### Size Specifications

**Spinner Sizes**
- sm: 16px × 16px
- md: 24px × 24px
- lg: 32px × 32px

**Skeleton Heights**
- sm: 64px
- md: 96px
- lg: 128px

**Progress Bar Heights**
- sm: 4px
- md: 8px
- lg: 12px

---

### ErrorState

A component for displaying error messages with optional retry functionality.

#### Features
- Shake animation for validation errors (400ms)
- Retry button with hover animation
- Error icon with pulse animation
- 3 size variants
- Auto-dismiss support (via parent component)
- Full accessibility support

#### Props

```typescript
interface ErrorStateProps {
  title?: string;                   // Error title (default: "Error")
  message: string;                  // Error message (required)
  className?: string;               // Additional classes
  onRetry?: () => void;            // Retry callback
  retryText?: string;              // Retry button text (default: "Try Again")
  shake?: boolean;                 // Enable shake animation
  size?: 'sm' | 'md' | 'lg';       // Size variant
  showIcon?: boolean;              // Show error icon (default: true)
}
```

#### Usage Examples

**Basic Error**
```tsx
import { ErrorState } from '@/components/enhanced/ErrorState';

<ErrorState
  message="Unable to load data"
/>
```

**Error with Retry**
```tsx
<ErrorState
  title="Operation Failed"
  message="Unable to complete the operation"
  onRetry={handleRetry}
/>
```

**Validation Error with Shake**
```tsx
<ErrorState
  title="Validation Error"
  message="Please fill in all required fields"
  shake
  size="sm"
/>
```

**Custom Retry Text**
```tsx
<ErrorState
  message="Connection lost"
  onRetry={reconnect}
  retryText="Reconnect"
/>
```

**Without Icon**
```tsx
<ErrorState
  message="Minor issue occurred"
  showIcon={false}
  size="sm"
/>
```

#### Animation Details

**Shake Animation**
- Keyframes: translateX(-4px → 4px → -4px → 4px → -2px → 2px → 0)
- Duration: 400ms
- Easing: ease-in-out
- Trigger: On mount when `shake={true}`

**Icon Pulse**
- Scale: 1 → 1.1 → 1
- Opacity: 1 → 0.8 → 1
- Duration: 2s
- Repeat: Infinite

---

## Style Guide

### Typography Hierarchy

```css
/* Headings */
h1: 36px, font-weight: 700, line-height: 1.25
h2: 30px, font-weight: 600, line-height: 1.25
h3: 24px, font-weight: 600, line-height: 1.25
h4: 20px, font-weight: 600, line-height: 1.5

/* Body Text */
Large: 18px, font-weight: 400, line-height: 1.5
Base: 16px, font-weight: 400, line-height: 1.5
Small: 14px, font-weight: 400, line-height: 1.5
Extra Small: 12px, font-weight: 400, line-height: 1.5
```

### Spacing System

Use consistent spacing based on the 8px grid:

```
xs:  8px  - Tight spacing within components
sm:  12px - Component internal spacing
md:  16px - Default spacing between elements
lg:  24px - Section spacing
xl:  32px - Page padding
2xl: 48px - Major section breaks
```

### Grid Layouts

**Responsive Card Grid**
```tsx
<div className="grid gap-5 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
  {/* Cards */}
</div>
```

**Breakpoints**
- Mobile: < 768px (1 column)
- Tablet: 768px - 1023px (1-2 columns)
- Desktop: 1024px - 1439px (2 columns)
- Large Desktop: ≥ 1440px (3 columns)

### Shadow System

```css
/* Subtle shadows for cards */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)

/* Elevation shadows for hover states */
--shadow-elevation-md: 0 8px 12px -2px rgb(0 0 0 / 0.15)
--shadow-elevation-lg: 0 16px 24px -4px rgb(0 0 0 / 0.2)
```

### Icon Guidelines

- **Size**: Use 20px-24px for most icons
- **Stroke Width**: 2 for regular, 2.5 for emphasis
- **Color**: Match text color hierarchy
- **Spacing**: 8-12px gap between icon and text

**Example**
```tsx
<div className="flex items-center gap-3">
  <FileIcon className="h-5 w-5 text-[var(--color-text-secondary)]" />
  <span>File name</span>
</div>
```

---

## Accessibility

All components follow WCAG 2.1 Level AA guidelines.

### Keyboard Navigation

| Component | Key | Action |
|-----------|-----|--------|
| InteractiveCard | Tab | Focus card |
| InteractiveCard | Enter/Space | Activate onClick |
| AnimatedButton | Tab | Focus button |
| AnimatedButton | Enter/Space | Activate button |
| All | Shift+Tab | Reverse focus |

### Focus Indicators

All interactive elements have visible focus indicators:
```css
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-[var(--focus-ring-color)]
focus-visible:ring-offset-2
```

### Color Contrast

All text meets WCAG AA standards (4.5:1 minimum):

| Text Color | Background | Contrast Ratio | Rating |
|------------|------------|----------------|--------|
| #e5e5e5 | #0a0a0a | 14.7:1 | AAA |
| #a3a3a3 | #0a0a0a | 7.2:1 | AAA |
| #737373 | #0a0a0a | 4.6:1 | AA |

### Screen Reader Support

- All buttons have descriptive labels
- Loading states use `aria-live="polite"`
- Error states use `aria-live="assertive"`
- Progress bars have `role="progressbar"` with aria-valuenow
- Icons have `aria-hidden="true"` when decorative

### Reduced Motion

All components respect `prefers-reduced-motion`:

```typescript
const shouldReduceMotion = useReducedMotion();

const transition = shouldReduceMotion 
  ? { duration: 0 } 
  : { duration: 0.3 };
```

When reduced motion is enabled:
- Animation durations set to 0
- Transforms disabled
- Only essential state changes shown

---

## Performance

### Optimization Techniques

**1. GPU Acceleration**
```css
/* Use transform and opacity for animations */
transform: translateY(-2px);  /* GPU accelerated */
opacity: 0.8;                 /* GPU accelerated */

/* Avoid animating these properties */
height: auto;                 /* Causes reflow */
width: 100%;                  /* Causes reflow */
```

**2. Will-Change Hints**
```css
.will-change-transform {
  will-change: transform;
}

.will-change-transform-opacity {
  will-change: transform, opacity;
}
```

**3. Framer Motion Optimization**
```typescript
// Use layout animations sparingly
<motion.div layout>  {/* Expensive */}

// Prefer transform animations
<motion.div animate={{ y: -2 }}>  {/* Cheap */}
```

### Performance Targets

- **Animation FPS**: 60fps (16.67ms per frame)
- **Bundle Size**: < 50KB additional for all enhanced components
- **First Paint**: No blocking animations
- **Interaction Response**: < 100ms

### Monitoring

Use Chrome DevTools Performance tab:
1. Record interaction
2. Check for dropped frames (green bars)
3. Verify no layout thrashing
4. Confirm GPU acceleration (purple bars)

---

## Best Practices

### Component Composition

**✅ Good: Compose components**
```tsx
<InteractiveCard onClick={handleClick}>
  <div className="flex items-center justify-between">
    <StatDisplay label="Files" value={count} />
    <AnimatedButton size="sm">View</AnimatedButton>
  </div>
</InteractiveCard>
```

**❌ Bad: Duplicate styles**
```tsx
<div className="bg-[#141414] border border-[#1f1f1f] rounded-lg p-6">
  {/* Don't recreate card styles */}
</div>
```

### Loading States

**✅ Good: Use appropriate variant**
```tsx
{/* For operations with progress */}
<LoadingState type="progress" progress={percent} />

{/* For unknown duration */}
<LoadingState type="spinner" message="Loading..." />

{/* For content placeholders */}
<LoadingState type="skeleton" />
```

### Error Handling

**✅ Good: Provide context and actions**
```tsx
<ErrorState
  title="Failed to Load Data"
  message="Unable to connect to the server. Please check your connection."
  onRetry={refetch}
  retryText="Try Again"
/>
```

**❌ Bad: Generic errors**
```tsx
<ErrorState message="Error" />
```

### Accessibility

**✅ Good: Semantic HTML and ARIA**
```tsx
<AnimatedButton
  onClick={handleSave}
  loading={isSaving}
  aria-label="Save changes to document"
>
  Save
</AnimatedButton>
```

**❌ Bad: Missing labels**
```tsx
<button onClick={handleSave}>
  <SaveIcon />
</button>
```

---

## Migration Guide

### From Standard Components

**Card → InteractiveCard**
```tsx
// Before
<Card className="p-6">
  <CardContent>...</CardContent>
</Card>

// After
<InteractiveCard>
  ...
</InteractiveCard>
```

**Button → AnimatedButton**
```tsx
// Before
<Button onClick={handleClick}>
  Click me
</Button>

// After
<AnimatedButton variant="primary" onClick={handleClick}>
  Click me
</AnimatedButton>
```

**Custom Loading → LoadingState**
```tsx
// Before
{isLoading && <Spinner />}

// After
{isLoading && <LoadingState type="spinner" message="Loading..." />}
```

---

## Examples Gallery

### Dashboard Card
```tsx
<InteractiveCard onClick={() => navigate('/details')}>
  <div className="flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold">System Performance</h3>
      <TrendingUp className="h-5 w-5 text-success" />
    </div>
    
    <div className="grid grid-cols-2 gap-4">
      <StatDisplay label="CPU Usage" value="45" unit="%" trend="down" />
      <StatDisplay label="Memory" value="8.2" unit="GB" trend="up" />
    </div>
    
    <AnimatedButton variant="outline" size="sm">
      View Details
    </AnimatedButton>
  </div>
</InteractiveCard>
```

### Form with Loading
```tsx
<form onSubmit={handleSubmit}>
  <InteractiveCard>
    <div className="flex flex-col gap-4">
      <input type="text" placeholder="Enter name" />
      
      {error && (
        <ErrorState
          message={error}
          shake
          size="sm"
        />
      )}
      
      <AnimatedButton
        type="submit"
        loading={isSubmitting}
        disabled={!isValid}
      >
        Submit
      </AnimatedButton>
    </div>
  </InteractiveCard>
</form>
```

### File Operation Progress
```tsx
<InteractiveCard>
  <div className="flex flex-col gap-4">
    <h3 className="text-lg font-semibold">Cleaning Files</h3>
    
    <LoadingState
      type="progress"
      progress={progress}
      message={`${filesProcessed} of ${totalFiles} files`}
    />
    
    <div className="grid grid-cols-3 gap-4">
      <StatDisplay label="Scanned" value={scanned} size="sm" />
      <StatDisplay label="Deleted" value={deleted} size="sm" />
      <StatDisplay label="Freed" value={freed} unit="MB" size="sm" />
    </div>
  </div>
</InteractiveCard>
```

---

## Support

For issues, questions, or contributions, please refer to the main project documentation.

**Version**: 1.0.0  
**Last Updated**: November 2025  
**Maintained by**: Windows Booster Team
