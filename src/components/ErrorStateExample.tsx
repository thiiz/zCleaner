/**
 * ErrorState and Toast Usage Examples
 * 
 * This file demonstrates how to use the ErrorState and Toast components
 * in your application.
 */

import React, { useState } from 'react';
import { ErrorState } from './ErrorState';
import { useToast } from './ToastContainer';
import { AnimatedButton } from './AnimatedButton';

/**
 * Example 1: Basic ErrorState with retry
 */
export const BasicErrorExample: React.FC = () => {
  const [error, setError] = useState(true);

  const handleRetry = () => {
    console.log('Retrying operation...');
    setError(false);
    setTimeout(() => setError(true), 3000); // Reset for demo
  };

  if (!error) return <div>Operation successful!</div>;

  return (
    <ErrorState
      title="Operation Failed"
      message="Unable to complete the operation. Please try again."
      onRetry={handleRetry}
    />
  );
};

/**
 * Example 2: Validation Error with shake animation
 */
export const ValidationErrorExample: React.FC = () => {
  const [showError, setShowError] = useState(false);

  const handleSubmit = () => {
    setShowError(true);
    setTimeout(() => setShowError(false), 2000);
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        className="w-full p-2 rounded border border-[var(--color-border-default)] bg-[var(--color-bg-tertiary)]"
        placeholder="Enter email"
      />
      
      {showError && (
        <ErrorState
          message="Please enter a valid email address"
          shake
          size="sm"
        />
      )}
      
      <AnimatedButton onClick={handleSubmit}>
        Submit
      </AnimatedButton>
    </div>
  );
};

/**
 * Example 3: Toast Notifications
 */
export const ToastExample: React.FC = () => {
  const toast = useToast();

  return (
    <div className="flex flex-col gap-3">
      <AnimatedButton
        variant="primary"
        onClick={() => toast.success('Operation completed successfully!')}
      >
        Show Success Toast
      </AnimatedButton>

      <AnimatedButton
        variant="secondary"
        onClick={() => toast.error('Something went wrong', 'Error')}
      >
        Show Error Toast
      </AnimatedButton>

      <AnimatedButton
        variant="outline"
        onClick={() => toast.warning('Please review your input', 'Warning')}
      >
        Show Warning Toast
      </AnimatedButton>

      <AnimatedButton
        variant="ghost"
        onClick={() => toast.info('New update available', 'Info')}
      >
        Show Info Toast
      </AnimatedButton>

      <AnimatedButton
        variant="outline"
        onClick={() => {
          toast.showToast({
            type: 'error',
            title: 'Custom Toast',
            message: 'This toast will dismiss in 3 seconds',
            duration: 3000,
          });
        }}
      >
        Show Custom Duration Toast
      </AnimatedButton>
    </div>
  );
};

/**
 * Example 4: Error State in a Card
 */
export const ErrorInCardExample: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleOperation = async () => {
    setLoading(true);
    setError(false);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setError(true);
    }, 2000);
  };

  const handleRetry = () => {
    handleOperation();
  };

  return (
    <div className="p-6 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)]">
      <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
        Data Loading
      </h2>

      {error ? (
        <ErrorState
          title="Failed to Load Data"
          message="Unable to fetch the requested data from the server."
          onRetry={handleRetry}
          size="md"
        />
      ) : (
        <div className="space-y-4">
          <p className="text-[var(--color-text-secondary)]">
            Click the button to simulate a failed operation.
          </p>
          <AnimatedButton
            onClick={handleOperation}
            loading={loading}
          >
            Load Data
          </AnimatedButton>
        </div>
      )}
    </div>
  );
};

/**
 * Example 5: Multiple Error States
 */
export const MultipleErrorsExample: React.FC = () => {
  return (
    <div className="space-y-4">
      <ErrorState
        message="Network connection lost"
        size="sm"
        showIcon={false}
      />

      <ErrorState
        title="Validation Error"
        message="Please fill in all required fields"
        shake
        size="md"
      />

      <ErrorState
        title="Server Error"
        message="The server encountered an error and could not complete your request."
        onRetry={() => console.log('Retry')}
        retryText="Retry Request"
        size="lg"
      />
    </div>
  );
};

/**
 * Example 6: Integration with Toast for operation feedback
 */
export const OperationFeedbackExample: React.FC = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      const success = Math.random() > 0.5;

      if (success) {
        toast.success('Changes saved successfully');
      } else {
        toast.error('Failed to save changes. Please try again.', 'Save Failed');
      }
    }, 2000);
  };

  const handleDelete = async () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      toast.warning('This action cannot be undone', 'Item Deleted');
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)]">
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
          Document Settings
        </h3>
        <p className="text-[var(--color-text-secondary)] mb-4">
          Make changes to your document settings.
        </p>

        <div className="flex gap-3">
          <AnimatedButton
            onClick={handleSave}
            loading={loading}
          >
            Save Changes
          </AnimatedButton>

          <AnimatedButton
            variant="outline"
            onClick={handleDelete}
            loading={loading}
            className="border-[var(--color-error)] text-[var(--color-error)] hover:bg-[var(--color-error)]/10"
          >
            Delete
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
};
