// Mobile utilities and touch gesture handlers
"use client";

import { useState, useEffect, useRef, RefObject } from 'react';

// Hook for detecting touch gestures
export function useSwipeGesture(
  ref: RefObject<HTMLElement>,
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  threshold: number = 50
) {
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchEnd = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchEnd.current = null;
      touchStart.current = {
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY,
      };
      setIsSwiping(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEnd.current = {
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY,
      };
    };

    const handleTouchEnd = () => {
      if (!touchStart.current || !touchEnd.current) {
        setIsSwiping(false);
        return;
      }

      const distanceX = touchStart.current.x - touchEnd.current.x;
      const distanceY = touchStart.current.y - touchEnd.current.y;
      const isLeftSwipe = distanceX > threshold;
      const isRightSwipe = distanceX < -threshold;
      const isVerticalSwipe = Math.abs(distanceY) > Math.abs(distanceX);

      if (!isVerticalSwipe) {
        if (isLeftSwipe && onSwipeLeft) {
          onSwipeLeft();
        }
        if (isRightSwipe && onSwipeRight) {
          onSwipeRight();
        }
      }

      setIsSwiping(false);
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [ref, onSwipeLeft, onSwipeRight, threshold]);

  return { isSwiping };
}

// Hook for detecting device capabilities
export function useDeviceCapabilities() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [screenSize, setScreenSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');

  useEffect(() => {
    const checkCapabilities = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);

      const width = window.innerWidth;
      setIsSmallScreen(width < 768);

      if (width < 640) setScreenSize('sm');
      else if (width < 768) setScreenSize('md');
      else if (width < 1024) setScreenSize('lg');
      else setScreenSize('xl');
    };

    checkCapabilities();
    window.addEventListener('resize', checkCapabilities);
    return () => window.removeEventListener('resize', checkCapabilities);
  }, []);

  return { isTouchDevice, isSmallScreen, screenSize };
}

// Enhanced mobile button with larger touch targets
interface MobileButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
}

export function MobileButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled = false,
}: MobileButtonProps) {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-black text-white hover:bg-gray-800 focus:ring-black active:bg-gray-900',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 active:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:bg-red-800',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 py-3 text-base min-h-[44px]',
    lg: 'px-6 py-4 text-lg min-h-[52px]',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
}

// Mobile-optimized input component
interface MobileInputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

export function MobileInput({
  type = 'text',
  placeholder,
  value,
  onChange,
  label,
  error,
  required = false,
  className = '',
}: MobileInputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors min-h-[44px] ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

// Mobile-friendly card component
interface MobileCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: 'sm' | 'md' | 'lg';
}

export function MobileCard({
  children,
  className = '',
  onClick,
  padding = 'md',
}: MobileCardProps) {
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const interactiveClasses = onClick
    ? 'cursor-pointer hover:shadow-md active:scale-[0.98] transition-all duration-200'
    : '';

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${paddingClasses[padding]} ${interactiveClasses} ${className}`}
    >
      {children}
    </div>
  );
}

// Mobile navigation tabs
interface MobileTabsProps {
  tabs: Array<{ id: string; label: string; icon?: string }>;
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function MobileTabs({
  tabs,
  activeTab,
  onChange,
  className = '',
}: MobileTabsProps) {
  const { isSmallScreen } = useDeviceCapabilities();

  if (isSmallScreen) {
    return (
      <div className={`flex overflow-x-auto scrollbar-hide bg-white border-b border-gray-200 ${className}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex-shrink-0 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors min-w-[80px] ${
              activeTab === tab.id
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex space-x-1 bg-gray-100 p-1 rounded-lg ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === tab.id
              ? 'bg-white text-black shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {tab.icon && <span className="mr-2">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// Mobile-optimized modal
interface MobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export function MobileModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}: MobileModalProps) {
  const { isSmallScreen } = useDeviceCapabilities();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: isSmallScreen ? 'max-w-sm' : 'max-w-md',
    md: isSmallScreen ? 'max-w-full' : 'max-w-lg',
    lg: isSmallScreen ? 'max-w-full' : 'max-w-2xl',
    full: 'max-w-full',
  };

  const modalClasses = isSmallScreen && (size === 'md' || size === 'lg' || size === 'full')
    ? 'h-full rounded-none'
    : 'max-h-[90vh] rounded-lg';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        <div className={`relative bg-white shadow-xl ${modalClasses} ${sizeClasses[size]} w-full`}>
          {title && (
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// Pull-to-refresh component
interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  disabled?: boolean;
}

export function PullToRefresh({
  onRefresh,
  children,
  disabled = false,
}: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const currentY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || isRefreshing) return;
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (disabled || isRefreshing) return;
    currentY.current = e.touches[0].clientY;
    const distance = currentY.current - startY.current;

    if (distance > 0 && window.scrollY === 0) {
      setIsPulling(true);
      setPullDistance(Math.min(distance * 0.5, 80));
    }
  };

  const handleTouchEnd = async () => {
    if (disabled || isRefreshing) return;

    if (isPulling && pullDistance > 50) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }

    setIsPulling(false);
    setPullDistance(0);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      {/* Pull indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-200 z-10"
        style={{
          height: pullDistance,
          transform: `translateY(-${Math.max(0, 80 - pullDistance)}px)`,
        }}
      >
        {(isPulling || isRefreshing) && (
          <div className="flex items-center space-x-2 text-gray-600">
            <div className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`}>
              {isRefreshing ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
            </div>
            <span className="text-sm">
              {isRefreshing ? 'Refreshing...' : pullDistance > 50 ? 'Release to refresh' : 'Pull to refresh'}
            </span>
          </div>
        )}
      </div>

      <div style={{ transform: `translateY(${pullDistance}px)` }}>
        {children}
      </div>
    </div>
  );
}