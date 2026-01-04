import React, { useState } from 'react';

export default function SearchMessages({ onSearch }) {
  const [q, setQ] = useState('');
  return (
    <div className="dc-search-messages">
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search messages" />
      <button onClick={() => onSearch && onSearch(q)}>Search</button>
    </div>
  );
}
