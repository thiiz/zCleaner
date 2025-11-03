/**
 * AnimatedButton Usage Examples
 * 
 * This file demonstrates various use cases of the AnimatedButton component.
 * Can be used for testing and reference.
 */

import React, { useState } from 'react';
import { AnimatedButton } from './enhanced/AnimatedButton';
import { Save, Trash2, Download, Settings } from 'lucide-react';

export const AnimatedButtonExamples: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleAsyncAction = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="p-8 space-y-8 bg-[var(--color-bg-primary)] min-h-screen">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
          Variants
        </h2>
        <div className="flex gap-4 flex-wrap">
          <AnimatedButton variant="primary">
            Primary Button
          </AnimatedButton>
          <AnimatedButton variant="secondary">
            Secondary Button
          </AnimatedButton>
          <AnimatedButton variant="outline">
            Outline Button
          </AnimatedButton>
          <AnimatedButton variant="ghost">
            Ghost Button
          </AnimatedButton>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
          Sizes
        </h2>
        <div className="flex gap-4 items-center flex-wrap">
          <AnimatedButton size="sm">
            Small
          </AnimatedButton>
          <AnimatedButton size="md">
            Medium
          </AnimatedButton>
          <AnimatedButton size="lg">
            Large
          </AnimatedButton>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
          With Icons
        </h2>
        <div className="flex gap-4 flex-wrap">
          <AnimatedButton icon={<Save className="h-4 w-4" />}>
            Save
          </AnimatedButton>
          <AnimatedButton variant="secondary" icon={<Download className="h-4 w-4" />}>
            Download
          </AnimatedButton>
          <AnimatedButton variant="outline" icon={<Settings className="h-4 w-4" />}>
            Settings
          </AnimatedButton>
          <AnimatedButton variant="ghost" icon={<Trash2 className="h-4 w-4" />}>
            Delete
          </AnimatedButton>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
          Loading State
        </h2>
        <div className="flex gap-4 flex-wrap">
          <AnimatedButton loading>
            Loading...
          </AnimatedButton>
          <AnimatedButton variant="secondary" loading>
            Processing
          </AnimatedButton>
          <AnimatedButton 
            variant="primary" 
            loading={loading}
            onClick={handleAsyncAction}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </AnimatedButton>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
          Disabled State
        </h2>
        <div className="flex gap-4 flex-wrap">
          <AnimatedButton disabled>
            Disabled Primary
          </AnimatedButton>
          <AnimatedButton variant="secondary" disabled>
            Disabled Secondary
          </AnimatedButton>
          <AnimatedButton variant="outline" disabled icon={<Save className="h-4 w-4" />}>
            Disabled with Icon
          </AnimatedButton>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
          Combined Variants
        </h2>
        <div className="flex gap-4 flex-wrap">
          <AnimatedButton 
            variant="primary" 
            size="lg" 
            icon={<Download className="h-5 w-5" />}
          >
            Download Now
          </AnimatedButton>
          <AnimatedButton 
            variant="secondary" 
            size="sm" 
            icon={<Settings className="h-3 w-3" />}
          >
            Configure
          </AnimatedButton>
          <AnimatedButton 
            variant="outline" 
            size="md" 
            icon={<Trash2 className="h-4 w-4" />}
          >
            Remove Item
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
};

export default AnimatedButtonExamples;
