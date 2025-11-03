import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatDisplayProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  mono?: boolean;
  className?: string;
}

const StatDisplay: React.FC<StatDisplayProps> = ({
  label,
  value,
  unit,
  trend,
  size = 'md',
  mono = true,
  className,
}) => {
  // Size configurations
  const sizeConfig = {
    sm: {
      label: 'text-xs',
      value: 'text-base',
      icon: 14,
      gap: 'gap-1',
    },
    md: {
      label: 'text-sm',
      value: 'text-xl',
      icon: 16,
      gap: 'gap-2',
    },
    lg: {
      label: 'text-base',
      value: 'text-2xl',
      icon: 20,
      gap: 'gap-2',
    },
  };

  const config = sizeConfig[size];

  // Trend icon and color
  const getTrendIcon = () => {
    if (!trend) return null;

    const iconSize = config.icon;
    const iconProps = { size: iconSize, strokeWidth: 2.5 };

    switch (trend) {
      case 'up':
        return <TrendingUp {...iconProps} className="text-[var(--color-success)]" />;
      case 'down':
        return <TrendingDown {...iconProps} className="text-[var(--color-error)]" />;
      case 'neutral':
        return <Minus {...iconProps} className="text-[var(--color-text-secondary)]" />;
      default:
        return null;
    }
  };

  return (
    <div className={cn('flex flex-col', config.gap, className)}>
      {/* Label */}
      <span
        className={cn(
          config.label,
          'text-[var(--color-text-tertiary)] font-normal'
        )}
      >
        {label}
      </span>

      {/* Value with optional unit and trend */}
      <div className="flex items-baseline gap-2">
        <span
          className={cn(
            config.value,
            'text-[var(--color-text-primary)] font-semibold',
            mono && 'font-mono'
          )}
        >
          {value}
        </span>

        {unit && (
          <span
            className={cn(
              config.label,
              'text-[var(--color-text-secondary)] font-normal'
            )}
          >
            {unit}
          </span>
        )}

        {trend && (
          <span className="inline-flex items-center ml-1">
            {getTrendIcon()}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatDisplay;
