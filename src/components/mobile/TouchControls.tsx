import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '../ui/Button';

interface TouchControlsProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onReset?: () => void;
  showZoomControls?: boolean;
  showSwipeControls?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onSwipeLeft,
  onSwipeRight,
  onZoomIn,
  onZoomOut,
  onReset,
  showZoomControls = false,
  showSwipeControls = false,
  children,
  className = '',
}) => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;
    const isVerticalSwipe = Math.abs(distanceY) > Math.abs(distanceX);

    // Only handle horizontal swipes
    if (!isVerticalSwipe) {
      if (isLeftSwipe && onSwipeLeft) {
        onSwipeLeft();
      }
      if (isRightSwipe && onSwipeRight) {
        onSwipeRight();
      }
    }
  };

  // Add pull-to-refresh functionality
  useEffect(() => {
    let startY = 0;
    let currentY = 0;
    let pullDistance = 0;
    const threshold = 100;

    const handlePullStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
      }
    };

    const handlePullMove = (e: TouchEvent) => {
      if (startY === 0) return;
      
      currentY = e.touches[0].clientY;
      pullDistance = currentY - startY;
      
      if (pullDistance > 0 && window.scrollY === 0) {
        e.preventDefault();
        
        // Visual feedback for pull-to-refresh
        if (containerRef.current) {
          const opacity = Math.min(pullDistance / threshold, 1);
          containerRef.current.style.transform = `translateY(${Math.min(pullDistance * 0.5, 50)}px)`;
          containerRef.current.style.opacity = `${1 - opacity * 0.2}`;
        }
      }
    };

    const handlePullEnd = () => {
      if (pullDistance > threshold && window.scrollY === 0) {
        // Trigger refresh
        window.location.reload();
      }
      
      // Reset visual state
      if (containerRef.current) {
        containerRef.current.style.transform = '';
        containerRef.current.style.opacity = '';
      }
      
      startY = 0;
      currentY = 0;
      pullDistance = 0;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', handlePullStart, { passive: false });
      container.addEventListener('touchmove', handlePullMove, { passive: false });
      container.addEventListener('touchend', handlePullEnd);
    }

    return () => {
      if (container) {
        container.removeEventListener('touchstart', handlePullStart);
        container.removeEventListener('touchmove', handlePullMove);
        container.removeEventListener('touchend', handlePullEnd);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}

      {/* Swipe Controls */}
      {showSwipeControls && (
        <div className="md:hidden absolute top-1/2 left-0 right-0 flex justify-between px-4 pointer-events-none">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSwipeRight}
            icon={ChevronLeft}
            className="pointer-events-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={onSwipeLeft}
            icon={ChevronRight}
            className="pointer-events-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
          />
        </div>
      )}

      {/* Zoom Controls */}
      {showZoomControls && (
        <div className="md:hidden absolute bottom-4 right-4 flex flex-col space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onZoomIn}
            icon={ZoomIn}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={onZoomOut}
            icon={ZoomOut}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            icon={RotateCcw}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
          />
        </div>
      )}
    </div>
  );
};