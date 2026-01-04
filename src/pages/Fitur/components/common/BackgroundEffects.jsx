import React from 'react';

const BackgroundEffects = () => (
  <div className="absolute inset-0 -z-10">
    <div className="absolute top-5 sm:top-10 left-5 sm:left-10 w-40 sm:w-64 h-40 sm:h-64 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-5 sm:bottom-10 right-5 sm:right-10 w-48 sm:w-72 h-48 sm:h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
    <div className="absolute top-1/2 right-1/4 w-56 sm:w-96 h-56 sm:h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
  </div>
);

export default BackgroundEffects;