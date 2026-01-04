import { useMemo } from 'react';
import StreamingAPI from '../lib/apiClient';

export default function useStreamingApi() {
  return useMemo(() => ({ api: StreamingAPI }), []);
}
