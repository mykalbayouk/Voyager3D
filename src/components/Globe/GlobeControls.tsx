'use client';

import Button from '@/components/UI/Button';

interface GlobeControlsProps {
  onResetView: () => void;
  onToggleAutoRotate: () => void;
  autoRotate: boolean;
}

export const GlobeControls = ({
  onResetView,
  onToggleAutoRotate,
  autoRotate,
}: GlobeControlsProps) => {
  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
      <Button
        variant="secondary"
        size="sm"
        onClick={onToggleAutoRotate}
        className="bg-slate-800/80 backdrop-blur-sm hover:bg-slate-700/80"
        title={autoRotate ? 'Stop auto-rotation' : 'Start auto-rotation'}
      >
        {autoRotate ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M15 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </Button>
      
      <Button
        variant="secondary"
        size="sm"
        onClick={onResetView}
        className="bg-slate-800/80 backdrop-blur-sm hover:bg-slate-700/80"
        title="Reset view"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </Button>
    </div>
  );
};
