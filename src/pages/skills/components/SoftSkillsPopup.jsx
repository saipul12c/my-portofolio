// SoftSkillsPopup.jsx
import { motion, AnimatePresence } from "framer-motion";
import { formatYouTubeURL, levelToProgress } from "./SoftSkillsUtils";

export default function SoftSkillsPopup({ selectedSkill, setSelectedSkill, navigate }) {
  return (
    <AnimatePresence>
      {selectedSkill && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => {
            setSelectedSkill(null);
            // go back in history instead of hardcoded route
            try {
              navigate(-1);
            } catch {
              navigate("/");
            }
          }}
          role="presentation"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-gray-900/90 border border-gray-700 rounded-2xl shadow-2xl max-w-5xl w-full overflow-y-auto p-6 relative flex flex-col md:flex-row gap-6 max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={selectedSkill.name || "Detail skill"}
          >
            <button
              onClick={() => {
                setSelectedSkill(null);
                try {
                  navigate(-1);
                } catch {
                  navigate("/");
                }
              }}
              className="absolute top-4 right-4 p-2 bg-red-500 hover:bg-red-600 rounded-full text-white transition"
              aria-label="Tutup"
            >
              ✕
            </button>

            <div className="flex-1 space-y-3 min-w-0">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                {selectedSkill.name}
              </h2>

              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-3 py-1 rounded-2xl bg-white/20">
                  {selectedSkill.category}
                </span>
                <span
                  className={`text-xs px-3 py-1 rounded-2xl ${selectedSkill.levelColor}`}
                >
                  {selectedSkill.level}
                </span>
              </div>

              <p className="text-gray-300">{selectedSkill.description}</p>

              {selectedSkill.examples?.length > 0 && (
                <div>
                  <h3 className="text-emerald-400 font-semibold mb-2">
                    Contoh Penerapan:
                  </h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    {selectedSkill.examples.map((ex, i) => (
                      <li key={i}>{ex}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="w-full bg-gray-700 rounded-full h-3 mt-4 overflow-hidden">
                <motion.div
                  className="h-3 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${levelToProgress(selectedSkill.level)}%`,
                  }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>

            {selectedSkill.video && (
              <div className="flex-1 flex flex-col items-center min-w-0">
                <h3 className="text-pink-400 font-semibold mb-2">
                  Video Pendukung
                </h3>
                {(() => {
                  const videoURL = selectedSkill.video;
                  const embedURL = formatYouTubeURL(videoURL);
                  // ✅ Hapus escape karakter tidak perlu pada regex
                  const isShorts = /shorts[/?]/i.test(videoURL || "");
                  // jika embedURL kosong (invalid), tampilkan pesan
                  if (!embedURL) {
                    return (
                      <div className="p-4 bg-gray-800 rounded-xl text-sm text-gray-300">
                        Video URL tidak valid atau tidak bisa ditampilkan.
                      </div>
                    );
                  }
                  return (
                    <div
                      className={`overflow-hidden shadow-lg border border-gray-700 rounded-xl bg-black flex justify-center items-center ${
                        isShorts
                          ? "w-[220px] sm:w-[250px] md:w-[280px] aspect-[9/16] max-h-[420px]"
                          : "w-full aspect-video max-h-[360px]"
                      }`}
                    >
                      <iframe
                        className="w-full h-full rounded-lg"
                        src={embedURL}
                        title={selectedSkill.name}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  );
                })()}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
