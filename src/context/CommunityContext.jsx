import React, { useState, useEffect } from 'react';
import { CommunityContext } from './communityContextObject';

export const CommunityProvider = ({ children }) => {
  const [selectedCommunity, setSelectedCommunity] = useState(() => {
    try {
      const raw = localStorage.getItem('selectedCommunity');
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.error('Error reading selectedCommunity from localStorage:', err);
      return null;
    }
  });

  useEffect(() => {
    try {
      if (selectedCommunity) {
        localStorage.setItem('selectedCommunity', JSON.stringify(selectedCommunity));
      } else {
        localStorage.removeItem('selectedCommunity');
      }
    } catch (err) {
      console.warn('Error saving selectedCommunity to localStorage:', err);
    }
  }, [selectedCommunity]);

  const value = {
    selectedCommunity,
    setSelectedCommunity
  };

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
};

export default CommunityProvider;

// Re-export the `useCommunity` hook for convenience so importing
// from `CommunityContext` still works in places that expect it.
export { useCommunity } from './useCommunity';
