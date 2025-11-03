/**
 * LoadingState Component Examples
 * Demonstrates different variants and use cases
 */

import React from 'react';
import { LoadingState } from './LoadingState';

export const LoadingStateExamples: React.FC = () => {
  return (
    <div className="p-8 space-y-12 bg-[var(--color-bg-primary)] min-h-screen">
      <div className="space-y-4">
        <h2 className="text-[var(--color-text-primary)] text-xl font-semibold">
          LoadingState Component Examples
        </h2>
        <p className="text-[var(--color-text-secondary)]">
          Unified loading state component with multiple variants
        </p>
      </div>

      {/* Spinner Variants */}
      <section className="space-y-6">
        <h3 className="text-[var(--color-text-primary)] text-lg font-medium">
          Spinner Variant
        </h3>
        
        <div className="grid grid-cols-3 gap-8">
          <div className="p-6 bg-[var(--color-bg-secondary)] rounded-lg">
            <p className="text-[var(--color-text-tertiary)] text-sm mb-4">Small</p>
            <LoadingState type="spinner" size="sm" />
          </div>
          
          <div className="p-6 bg-[var(--color-bg-secondary)] rounded-lg">
            <p className="text-[var(--color-text-tertiary)] text-sm mb-4">Medium</p>
            <LoadingState type="spinner" size="md" />
          </div>
          
          <div className="p-6 bg-[var(--color-bg-secondary)] rounded-lg">
            <p className="text-[var(--color-text-tertiary)] text-sm mb-4">Large</p>
            <LoadingState type="spinner" size="lg" />
          </div>
        </div>

        <div className="p-6 bg-[var(--color-bg-secondary)] rounded-lg">
          <p className="text-[var(--color-text-tertiary)] text-sm mb-4">With Message</p>
          <LoadingState 
            type="spinner" 
            size="md" 
            message="Loading data..." 
          />
        </div>
      </section>

      {/* Skeleton Variants */}
      <section className="space-y-6">
        <h3 className="text-[var(--color-text-primary)] text-lg font-medium">
          Skeleton Variant
        </h3>
        
        <div className="space-y-4">
          <div className="p-6 bg-[var(--color-bg-secondary)] rounded-lg">
            <p className="text-[var(--color-text-tertiary)] text-sm mb-4">Small</p>
            <LoadingState type="skeleton" size="sm" />
          </div>
          
          <div className="p-6 bg-[var(--color-bg-secondary)] rounded-lg">
            <p className="text-[var(--color-text-tertiary)] text-sm mb-4">Medium</p>
            <LoadingState type="skeleton" size="md" />
          </div>
          
          <div className="p-6 bg-[var(--color-bg-secondary)] rounded-lg">
            <p className="text-[var(--color-text-tertiary)] text-sm mb-4">Large</p>
            <LoadingState type="skeleton" size="lg" />
          </div>

          <div className="p-6 bg-[var(--color-bg-secondary)] rounded-lg">
            <p className="text-[var(--color-text-tertiary)] text-sm mb-4">With Message</p>
            <LoadingState 
              type="skeleton" 
              size="md" 
              message="Loading content..." 
            />
          </div>
        </div>
      </section>

      {/* Progress Variants */}
      <section className="space-y-6">
        <h3 className="text-[var(--color-text-primary)] text-lg font-medium">
          Progress Variant
        </h3>
        
        <div className="space-y-4">
          <div className="p-6 bg-[var(--color-bg-secondary)] rounded-lg">
            <p className="text-[var(--color-text-tertiary)] text-sm mb-4">Small - 25%</p>
            <LoadingState type="progress" size="sm" progress={25} />
          </div>
          
          <div className="p-6 bg-[var(--color-bg-secondary)] rounded-lg">
            <p className="text-[var(--color-text-tertiary)] text-sm mb-4">Medium - 50%</p>
            <LoadingState type="progress" size="md" progress={50} />
          </div>
          
          <div className="p-6 bg-[var(--color-bg-secondary)] rounded-lg">
            <p className="text-[var(--color-text-tertiary)] text-sm mb-4">Large - 75%</p>
            <LoadingState type="progress" size="lg" progress={75} />
          </div>

          <div className="p-6 bg-[var(--color-bg-secondary)] rounded-lg">
            <p className="text-[var(--color-text-tertiary)] text-sm mb-4">With Message</p>
            <LoadingState 
              type="progress" 
              size="md" 
              progress={65} 
              message="Processing files..." 
            />
          </div>
        </div>
      </section>

      {/* Real-world Use Cases */}
      <section className="space-y-6">
        <h3 className="text-[var(--color-text-primary)] text-lg font-medium">
          Real-world Use Cases
        </h3>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="p-6 bg-[var(--color-bg-secondary)] rounded-lg space-y-4">
            <h4 className="text-[var(--color-text-primary)] font-medium">
              Scanning Files
            </h4>
            <LoadingState 
              type="spinner" 
              size="md" 
              message="Scanning system files..." 
            />
          </div>

          <div className="p-6 bg-[var(--color-bg-secondary)] rounded-lg space-y-4">
            <h4 className="text-[var(--color-text-primary)] font-medium">
              Deleting Files
            </h4>
            <LoadingState 
              type="progress" 
              size="md" 
              progress={45} 
              message="Deleting temporary files..." 
            />
          </div>

          <div className="p-6 bg-[var(--color-bg-secondary)] rounded-lg space-y-4">
            <h4 className="text-[var(--color-text-primary)] font-medium">
              Loading Content
            </h4>
            <LoadingState 
              type="skeleton" 
              size="lg" 
            />
          </div>

          <div className="p-6 bg-[var(--color-bg-secondary)] rounded-lg space-y-4">
            <h4 className="text-[var(--color-text-primary)] font-medium">
              Optimizing System
            </h4>
            <LoadingState 
              type="progress" 
              size="lg" 
              progress={88} 
              message="Optimizing performance..." 
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoadingStateExamples;
