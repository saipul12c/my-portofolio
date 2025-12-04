import React, { createContext, useContext, useState, useEffect } from 'react';

const CommunityContext = createContext(undefined);

export const CommunityProvider = ({ children }) => {
  const [selectedCommunity, setSelectedCommunity] = useState(() => {
    try {
      const raw = localStorage.getItem('selectedCommunity');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
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
    } catch (e) {
      // ignore storage errors
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

export const useCommunity = () => {
  const ctx = useContext(CommunityContext);
  if (ctx === undefined) throw new Error('useCommunity must be used within CommunityProvider');
  return ctx;
};

export default CommunityContext;
