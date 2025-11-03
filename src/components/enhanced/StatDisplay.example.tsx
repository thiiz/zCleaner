/**
 * StatDisplay Component Examples
 * Demonstrates various use cases and configurations
 */

import React from 'react';
import StatDisplay from './StatDisplay';

export const StatDisplayExamples: React.FC = () => {
  return (
    <div className="p-8 space-y-8 bg-[var(--color-bg-primary)]">
      <div>
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
          Basic Usage
        </h2>
        <div className="grid grid-cols-3 gap-6">
          <StatDisplay label="Total Files" value={1234} />
          <StatDisplay label="Cache Size" value="2.4" unit="GB" />
          <StatDisplay label="CPU Usage" value={45} unit="%" />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
          With Trends
        </h2>
        <div className="grid grid-cols-3 gap-6">
          <StatDisplay label="Performance" value={87} unit="%" trend="up" />
          <StatDisplay label="Memory Usage" value={62} unit="%" trend="down" />
          <StatDisplay label="Disk Space" value={50} unit="%" trend="neutral" />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
          Different Sizes
        </h2>
        <div className="grid grid-cols-3 gap-6">
          <StatDisplay label="Small" value={123} size="sm" />
          <StatDisplay label="Medium" value={456} size="md" />
          <StatDisplay label="Large" value={789} size="lg" />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
          Monospace vs Regular
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <StatDisplay label="With Monospace" value="1,234.56" unit="MB" mono={true} />
          <StatDisplay label="Without Monospace" value="1,234.56" unit="MB" mono={false} />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
          Real-World Examples
        </h2>
        <div className="grid grid-cols-4 gap-6">
          <StatDisplay 
            label="Temp Files" 
            value="847" 
            size="sm" 
            trend="down" 
          />
          <StatDisplay 
            label="Freed Space" 
            value="3.2" 
            unit="GB" 
            trend="up" 
          />
          <StatDisplay 
            label="Startup Items" 
            value={12} 
            trend="neutral" 
          />
          <StatDisplay 
            label="Boot Time" 
            value="24.5" 
            unit="sec" 
            size="lg" 
          />
        </div>
      </div>
    </div>
  );
};

export default StatDisplayExamples;
