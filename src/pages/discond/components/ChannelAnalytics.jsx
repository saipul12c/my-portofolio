import React, { useEffect, useState } from 'react';
import DiscondAPI from '../lib/apiClient';

export default function ChannelAnalytics({ serverId }) {
  const [data, setData] = useState(null);
  useEffect(() => { if (serverId) DiscondAPI.getAnalytics(serverId).then(setData).catch(()=>{}); }, [serverId]);
  return (
    <div className="dc-channel-analytics">
      <h4>Analytics</h4>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
