import { motion, AnimatePresence } from "framer-motion";

export function ChatbotSettings({ onClose }) {
  const theme = localStorage.getItem("saipul_theme") || "system";
  const accent = localStorage.getItem("saipul_accent") || "default";
  const language = localStorage.getItem("saipul_language") || "auto";

  const handleSave = (key, value) => {
    localStorage.setItem(key, value);
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[10000]"
      >
        <div className="bg-gray-900 text-gray-200 w-[450px] rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex">
            {/* Sidebar */}
            <div className="w-36 bg-gray-800 border-r border-gray-700 flex flex-col text-sm">
              <button className="p-3 text-left bg-gray-700/60">Umum</button>
              <button className="p-3 text-left hover:bg-gray-700/50">Notifikasi</button>
              <button className="p-3 text-left hover:bg-gray-700/50">Personalisasi</button>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 text-sm space-y-3">
              <h3 className="font-semibold text-white">Pengaturan</h3>

              <div className="space-y-2">
                <p className="text-gray-400 text-xs">Tema: {theme}</p>
                <p className="text-gray-400 text-xs">Aksen: {accent}</p>
                <p className="text-gray-400 text-xs">Bahasa: {language}</p>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  onClick={() => handleSave("saipul_theme", theme === "dark" ? "light" : "dark")}
                  className="px-4 py-1 rounded-md bg-gray-700 hover:bg-gray-600"
                >
                  Ubah Tema
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-1 rounded-md bg-gray-700 hover:bg-gray-600"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
