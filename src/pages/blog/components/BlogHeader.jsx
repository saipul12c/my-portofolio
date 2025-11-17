export default function BlogHeader() {
  return (
    <div className="text-center mb-12 sm:mb-16">
      <div className="inline-block mb-4">
        <span className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-medium">
          📚 Blog & Artikel
        </span>
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
        Cerita & Inspirasi
      </h1>
      <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
        Temukan artikel menarik seputar teknologi, desain, marketing, dan pengembangan diri dari para ahli.
      </p>
    </div>
  );
}