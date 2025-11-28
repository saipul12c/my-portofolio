import React from 'react';

const BackgroundEffects = () => (
  <div className="absolute inset-0 -z-10">
    <div className="absolute top-10 left-10 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
    <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
  </div>
);

export default BackgroundEffects;