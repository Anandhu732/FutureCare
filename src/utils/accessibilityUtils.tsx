// Accessibility utilities and WCAG AA compliant components
"use client";

import { useState, useEffect, useRef, ReactNode } from 'react';

// Screen reader only text component
export function ScreenReaderOnly({ children }: { children: ReactNode }) {
  return (
    <span className="sr-only">
      {children}
    </span>
  );
}

// Skip navigation link for keyboard users
export function SkipNavLink({ href = "#main-content" }: { href?: string }) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-black text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
    >
      Skip to main content
    </a>
  );
}

// Accessible button with enhanced focus states
interface AccessibleButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

export function AccessibleButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  type = 'button',
  className = '',
  ariaLabel,
  ariaDescribedBy,
}: AccessibleButtonProps) {
  const baseClasses = `
    font-medium rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-95 transform
  `;

  const variantClasses = {
    primary: `
      bg-black text-white hover:bg-gray-800 focus:ring-black
      disabled:bg-gray-400 disabled:hover:bg-gray-400
    `,
    secondary: `
      bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500
      border border-gray-300 disabled:bg-gray-100 disabled:hover:bg-gray-100
    `,
    danger: `
      bg-red-600 text-white hover:bg-red-700 focus:ring-red-500
      disabled:bg-red-300 disabled:hover:bg-red-300
    `,
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 py-3 text-base min-h-[44px]',
    lg: 'px-6 py-4 text-lg min-h-[52px]',
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `.replace(/\s+/g, ' ').trim()}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
          <span>Loading...</span>
          <ScreenReaderOnly>Please wait</ScreenReaderOnly>
        </div>
      ) : (
        children
      )}
    </button>
  );
}

// Accessible form input with proper labeling and error states
interface AccessibleInputProps {
  id: string;
  label: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  className?: string;
}

export function AccessibleInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  helpText,
  className = '',
}: AccessibleInputProps) {
  const helpTextId = helpText ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helpTextId, errorId].filter(Boolean).join(' ');

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-describedby={describedBy || undefined}
        aria-invalid={error ? 'true' : 'false'}
        className={`
          w-full px-4 py-3 text-base border rounded-lg transition-colors
          focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 hover:border-gray-400'
          }
          ${className}
        `.replace(/\s+/g, ' ').trim()}
      />

      {helpText && (
        <p id={helpTextId} className="text-sm text-gray-600">
          {helpText}
        </p>
      )}

      {error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          <span className="font-medium">Error:</span> {error}
        </p>
      )}
    </div>
  );
}

// Accessible select dropdown
interface AccessibleSelectProps {
  id: string;
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  className?: string;
}

export function AccessibleSelect({
  id,
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  error,
  helpText,
  className = '',
}: AccessibleSelectProps) {
  const helpTextId = helpText ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helpTextId, errorId].filter(Boolean).join(' ');

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>

      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        aria-describedby={describedBy || undefined}
        aria-invalid={error ? 'true' : 'false'}
        className={`
          w-full px-4 py-3 text-base border rounded-lg transition-colors appearance-none
          focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 hover:border-gray-400'
          }
          ${className}
        `.replace(/\s+/g, ' ').trim()}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

      {helpText && (
        <p id={helpTextId} className="text-sm text-gray-600">
          {helpText}
        </p>
      )}

      {error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          <span className="font-medium">Error:</span> {error}
        </p>
      )}
    </div>
  );
}

// Skeleton loader component
interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  variant?: 'text' | 'circle' | 'rectangle';
}

export function Skeleton({
  width = '100%',
  height = '1rem',
  className = '',
  variant = 'rectangle'
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-300';

  const variantClasses = {
    text: 'rounded',
    circle: 'rounded-full',
    rectangle: 'rounded-md',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
      aria-label="Loading content"
      role="presentation"
    />
  );
}

// Skeleton card for loading states
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="animate-pulse">
        <div className="flex items-start space-x-4">
          <Skeleton variant="circle" width="3rem" height="3rem" />
          <div className="flex-1 space-y-3">
            <Skeleton width="60%" height="1.25rem" />
            <Skeleton width="40%" height="1rem" />
            <Skeleton width="80%" height="1rem" />
            <div className="flex space-x-2 mt-4">
              <Skeleton width="5rem" height="2rem" />
              <Skeleton width="5rem" height="2rem" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Accessible modal with focus management
interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
}

export function AccessibleModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlayClick = true,
}: AccessibleModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store previously focused element
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Focus the modal
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);
    } else {
      // Restore body scroll
      document.body.style.overflow = 'unset';

      // Restore focus to previously active element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={closeOnOverlayClick ? onClose : undefined}
          aria-hidden="true"
        />

        {/* Modal content */}
        <div
          ref={modalRef}
          tabIndex={-1}
          className={`
            relative bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]}
            transform transition-all
            focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
              {title}
            </h2>
            <AccessibleButton
              onClick={onClose}
              variant="secondary"
              size="sm"
              ariaLabel="Close modal"
              className="!p-2 !min-h-0 hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </AccessibleButton>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// Toast notification component
interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export function Toast({
  message,
  type = 'info',
  isVisible,
  onClose,
  duration = 5000
}: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        fixed top-4 right-4 z-50 max-w-sm w-full
        border rounded-lg p-4 shadow-lg
        transform transition-all duration-300
        ${typeStyles[type]}
        ${isVisible ? 'translate-x-0' : 'translate-x-full'}
      `}
    >
      <div className="flex items-start">
        <span className="mr-3 text-lg" aria-hidden="true">
          {icons[type]}
        </span>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <AccessibleButton
          onClick={onClose}
          variant="secondary"
          size="sm"
          ariaLabel="Close notification"
          className="!p-1 !min-h-0 ml-2 opacity-70 hover:opacity-100"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </AccessibleButton>
      </div>
    </div>
  );
}

// Progress indicator
interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'red' | 'yellow';
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = false,
  size = 'md',
  color = 'blue',
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    yellow: 'bg-yellow-600',
  };

  return (
    <div>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm text-gray-600">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]}`}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || `Progress: ${Math.round(percentage)}%`}
      >
        <div
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Focus trap hook for modals and dropdowns
export function useFocusTrap(ref: React.RefObject<HTMLElement>, isActive: boolean) {
  useEffect(() => {
    if (!isActive || !ref.current) return;

    const element = ref.current;
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    return () => element.removeEventListener('keydown', handleTabKey);
  }, [ref, isActive]);
}