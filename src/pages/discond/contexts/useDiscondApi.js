import { useMemo } from 'react';
import DiscondAPI from '../lib/apiClient';

export default function useDiscondApi() {
  return useMemo(() => ({
    api: DiscondAPI,
  }), []);
}
