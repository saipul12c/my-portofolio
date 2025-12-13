import { useContext } from 'react';
import { CommunityContext } from './communityContextObject';

export const useCommunity = () => {
  const ctx = useContext(CommunityContext);
  if (ctx === undefined) throw new Error('useCommunity must be used within CommunityProvider');
  return ctx;
};

export default useCommunity;
