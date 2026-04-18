import React, { useState, useRef } from 'react';

interface Props {
  children: React.ReactNode;
  onSwipeRight?: () => void;
  disabled?: boolean;
}

export function Swipeable({ children, onSwipeRight, disabled }: Props) {
  const [translateX, setTranslateX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const startX = useRef(0);
  const threshold = 120; // pixels to trigger

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    startX.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping || disabled) return;
    const x = e.touches[0].clientX;
    const deltaX = x - startX.current;

    // Only allow sliding to the right (deltaX > 0)
    if (deltaX > 0) {
      // Add some damping for long swipes
      const damping = deltaX > 200 ? 200 + (deltaX - 200) * 0.2 : deltaX;
      setTranslateX(damping);
    }
  };

  const handleTouchEnd = () => {
    if (!isSwiping || disabled) return;
    setIsSwiping(false);

    if (translateX > threshold && onSwipeRight) {
      onSwipeRight();
    }

    setTranslateX(0);
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-danger-bg">
      {/* Background action indicator - visible when sliding right */}
      <div
        className="absolute inset-y-0 left-0 flex items-center px-4 text-danger transition-opacity duration-150"
        style={{
          opacity: Math.min(translateX / (threshold * 0.8), 1),
        }}
      >
        <div className="flex flex-col items-center gap-1">
          <div className="text-[12px] font-bold">Swipe to Remove</div>
        </div>
      </div>

      <div
        className={`relative ${!isSwiping ? 'transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)]' : ''}`}
        style={{
          transform: `translateX(${translateX}px)`,
          touchAction: 'pan-y', // Allow vertical scrolling
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}
