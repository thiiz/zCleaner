import { Zap } from 'lucide-react';

export default function Header() {
  return (
    <header 
      className="h-20 flex items-center"
      role="banner"
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderBottom: '1px solid var(--color-border-subtle)',
        paddingLeft: 'var(--spacing-lg)',
        paddingRight: 'var(--spacing-lg)',
      }}
    >
      <Zap 
        className="w-5 h-5 md:w-6 md:h-6 transition-all will-change-transform"
        style={{
          color: 'var(--color-text-secondary)',
          transitionDuration: 'var(--transition-base)',
          transitionTimingFunction: 'var(--ease-in-out)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--color-accent-primary)';
          e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--color-text-secondary)';
          e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
        }}
        aria-hidden="true"
      />
      <h1 
        className="text-lg md:text-xl font-medium tracking-tight"
        style={{
          color: 'var(--color-text-primary)',
          marginLeft: 'var(--spacing-sm)',
          fontWeight: 'var(--font-weight-semibold)',
          letterSpacing: 'var(--letter-spacing-tight)',
        }}
      >
        Windows Booster
      </h1>
    </header>
  );
}
