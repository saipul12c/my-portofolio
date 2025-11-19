const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6 sm:py-8">
      <div className="animate-pulse space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Header Skeleton */}
        <div className="h-6 sm:h-8 bg-slate-700 rounded w-1/4 mb-4 sm:mb-6 lg:mb-8"></div>
        
        {/* Profile Card Skeleton */}
        <div className="bg-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 -mt-8 sm:mt-0 mb-4 sm:mb-8">
            <div className="w-24 sm:w-32 lg:w-40 h-24 sm:h-32 lg:h-40 bg-slate-700 rounded-2xl sm:rounded-3xl flex-shrink-0"></div>
            <div className="flex-1 space-y-3 sm:space-y-4">
              <div className="h-6 sm:h-8 bg-slate-700 rounded w-full sm:w-2/3"></div>
              <div className="h-5 sm:h-6 bg-slate-700 rounded w-full sm:w-1/2"></div>
              <div className="flex flex-wrap gap-2">
                <div className="h-8 sm:h-10 bg-slate-700 rounded w-24 sm:w-32"></div>
                <div className="h-8 sm:h-10 bg-slate-700 rounded w-24 sm:w-32"></div>
              </div>
            </div>
          </div>
          
          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 sm:h-28 lg:h-32 bg-slate-700 rounded-xl sm:rounded-2xl"></div>
            ))}
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="flex gap-2 sm:gap-3 -mx-3 sm:mx-0 px-3 sm:px-0">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 sm:h-10 bg-slate-700 rounded-lg sm:rounded-xl w-20 sm:w-24 flex-shrink-0"></div>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="space-y-3 sm:space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 sm:h-40 lg:h-48 bg-slate-700 rounded-xl sm:rounded-2xl"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default LoadingSkeleton;