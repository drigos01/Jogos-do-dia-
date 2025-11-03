import React from 'react';

const GameCardSkeleton: React.FC = () => {
  return (
    <div className="bg-card-bg rounded-lg shadow-lg overflow-hidden animate-pulse">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="h-4 bg-white/10 rounded w-1/4"></div>
          <div className="h-4 bg-white/10 rounded w-1/3"></div>
        </div>
        <div className="flex justify-between items-center">
          {/* Team Skeleton */}
          <div className="flex flex-col items-center w-2/5">
            <div className="h-16 w-16 bg-white/10 rounded-full mb-2"></div>
            <div className="h-4 bg-white/10 rounded w-3/4"></div>
          </div>
          {/* Score Skeleton */}
          <div className="flex-1 flex justify-center items-center">
            <div className="h-6 bg-white/10 rounded w-1/2"></div>
          </div>
          {/* Team Skeleton */}
          <div className="flex flex-col items-center w-2/5">
            <div className="h-16 w-16 bg-white/10 rounded-full mb-2"></div>
            <div className="h-4 bg-white/10 rounded w-3/4"></div>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 bg-black/20">
        <div className="h-4 bg-white/10 rounded w-1/2 mx-auto mb-3"></div>
        <div className="flex w-full h-3 rounded-full overflow-hidden bg-brand-bg">
          <div className="bg-white/10 w-full h-full"></div>
        </div>
      </div>
      <div className="p-2 bg-black/20 border-t border-white/10 mt-auto">
        <div className="h-10 bg-white/10 rounded-md"></div>
      </div>
    </div>
  );
};

export default GameCardSkeleton;
