import React, { useEffect, useState } from 'react';
import StreamingAPI from '../lib/apiClient';

export default function RecommendationEngine({ userId }) {
  const [recs, setRecs] = useState([]);
  useEffect(() => { if (userId) StreamingAPI.getRecommendations(userId).then(setRecs).catch(()=>{}); }, [userId]);
  return (
    <div className="st-recommendation-engine">
      <h4>Recommendations</h4>
      <ul>{recs.map((r, i) => <li key={i}>{r.title}</li>)}</ul>
    </div>
  );
}
