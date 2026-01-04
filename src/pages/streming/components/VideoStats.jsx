import React, { useEffect, useState } from 'react';
import StreamingAPI from '../lib/apiClient';

export default function VideoStats({ videoId }) {
  const [stats, setStats] = useState(null);
  useEffect(() => { if (videoId) StreamingAPI.getStats(videoId).then(setStats).catch(()=>{}); }, [videoId]);
  return (
    <div className="st-video-stats">
      <h4>Video Stats</h4>
      <pre>{JSON.stringify(stats, null, 2)}</pre>
    </div>
  );
}
