export function Suggestions({ suggestions = [], setInput, onSelect }) {
  if (!suggestions || suggestions.length === 0) return null;

  const handleClick = (s) => {
    if (typeof onSelect === 'function') return onSelect(s);
    if (typeof setInput === 'function') return setInput(s);
  };

  return (
    <div className="space-y-2">
      <div className="text-xs text-gray-500 text-center">💡 Coba tanyakan:</div>
      <div className="flex flex-wrap gap-1 justify-center">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(suggestion)}
            className="saipul-suggestion-btn text-xs px-2 py-1 rounded transition border max-w-[45%] truncate"
            title={suggestion}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}