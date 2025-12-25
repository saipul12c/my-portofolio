export function ToggleSwitch({ checked, onChange, id }) {
  const trackStyle = {
    width: 44,
    height: 24,
    borderRadius: 999,
    transition: 'background-color 150ms ease, box-shadow 150ms ease'
  };

  const knobStyle = {
    width: 20,
    height: 20,
    borderRadius: 999,
    background: 'white',
    position: 'absolute',
    top: 2,
    left: checked ? 22 : 2,
    transition: 'left 150ms ease'
  };

  return (
    <label className="relative inline-flex items-center cursor-pointer" style={{display:'inline-block'}}>
      <input 
        type="checkbox" 
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
        id={id}
      />
      <div style={{...trackStyle, backgroundColor: checked ? 'var(--saipul-accent)' : 'var(--saipul-muted)', boxShadow: checked ? '0 0 0 4px rgba(0,0,0,0.06) inset' : 'none', position: 'relative'}} />
      <div style={knobStyle} />
    </label>
  );
}