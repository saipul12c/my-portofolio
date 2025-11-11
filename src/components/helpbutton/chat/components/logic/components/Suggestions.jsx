export function Suggestions({ suggestions, setInput }) {
  if (suggestions.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="text-xs text-gray-500 text-center">💡 Coba tanyakan:</div>
      <div className="flex flex-wrap gap-1 justify-center">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => setInput(suggestion)}
            className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded transition border border-gray-600 max-w-[45%] truncate"
            title={suggestion}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}