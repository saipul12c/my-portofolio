export default function DetailTools({ tools }) {
  return (
    <div className="bg-[#141a28]/60 rounded-2xl p-6 border border-white/10 backdrop-blur-md">
      <h3 className="text-lg font-semibold mb-4 text-cyan-300">🛠️ Alat & Resources</h3>
      <div className="flex flex-wrap gap-2">
        {tools.map((tool, index) => (
          <ToolTag key={index} tool={tool} />
        ))}
      </div>
    </div>
  );
}

function ToolTag({ tool }) {
  return (
    <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300 hover:bg-white/20 transition-colors">
      {tool}
    </span>
  );
}