import React from 'react';

const PresenceDot = ({ presence = 'offline', size = 10 }) => {
  const color = presence === 'online' ? '#3ba55d' : presence === 'idle' ? '#f59e0b' : presence === 'dnd' ? '#ef4444' : '#6b7280';
  // Outer background matches sidebar to create a ring effect, inner dot shows status
  const outer = Math.max(2, Math.round(size / 2));
  const inner = Math.max(6, size - outer * 2);

  return (
    <div
      aria-hidden
      style={{ width: size, height: size, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}
    >
      <div style={{ width: size, height: size, borderRadius: '50%', backgroundColor: '#40444b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: inner, height: inner, borderRadius: '50%', backgroundColor: color, boxShadow: '0 0 0 2px #40444b' }} />
      </div>
    </div>
  );
};

export default PresenceDot;
