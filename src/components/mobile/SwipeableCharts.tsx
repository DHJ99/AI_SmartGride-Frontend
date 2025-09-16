import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TouchControls } from './TouchControls';
import { Button } from '../ui/Button';

interface SwipeableChartsProps {
  charts: React.ReactNode[];
  titles: string[];
  className?: string;
}

export const SwipeableCharts: React.FC<SwipeableChartsProps> = ({
  charts,
  titles,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSwipeLeft = () => {
    if (currentIndex < charts.length - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(prev => prev + 1);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  const handleSwipeRight = () => {
    if (currentIndex > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(prev => prev - 1);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  const goToChart = (index: number) => {
    if (index !== currentIndex && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Chart Title */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {titles[currentIndex]}
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {currentIndex + 1} of {charts.length}
          </span>
        </div>
      </div>

      {/* Chart Container */}
      <TouchControls
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
        showSwipeControls={charts.length > 1}
        className="relative overflow-hidden rounded-lg"
      >
        <div
          className={`flex transition-transform duration-300 ease-in-out ${
            isTransitioning ? 'pointer-events-none' : ''
          }`}
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            width: `${charts.length * 100}%`,
          }}
        >
          {charts.map((chart, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0"
              style={{ width: `${100 / charts.length}%` }}
            >
              {chart}
            </div>
          ))}
        </div>
      </TouchControls>

      {/* Navigation Dots */}
      {charts.length > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          {charts.map((_, index) => (
            <button
              key={index}
              onClick={() => goToChart(index)}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentIndex
                  ? 'bg-blue-600'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
              aria-label={`Go to chart ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Navigation Arrows for larger screens */}
      {charts.length > 1 && (
        <div className="hidden sm:flex absolute top-1/2 left-0 right-0 justify-between px-4 pointer-events-none">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSwipeRight}
            icon={ChevronLeft}
            disabled={currentIndex === 0}
            className="pointer-events-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSwipeLeft}
            icon={ChevronRight}
            disabled={currentIndex === charts.length - 1}
            className="pointer-events-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
          />
        </div>
      )}
    </div>
  );
};