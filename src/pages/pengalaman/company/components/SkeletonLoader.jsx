const SkeletonLoader = ({ type = "card" }) => {
  if (type === "card") {
    return (
      <div className="animate-pulse bg-white/5 rounded-2xl p-6">
        <div className="flex gap-4">
          <div className="w-16 h-16 bg-gray-700 rounded-xl"></div>
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            <div className="h-3 bg-gray-700 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (type === "header") {
    return (
      <div className="animate-pulse bg-white/5 rounded-2xl p-8">
        <div className="h-8 bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      </div>
    );
  }
  
  return (
    <div className="animate-pulse bg-white/5 rounded-2xl p-6">
      <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-700 rounded w-5/6"></div>
    </div>
  );
};

export default SkeletonLoader;