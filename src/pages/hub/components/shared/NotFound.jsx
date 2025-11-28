import { Link } from "react-router-dom";

export default function NotFound({ message = "Halaman tidak ditemukan", onBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d111a] via-[#111726] to-[#0d111a] text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">{message}</h1>
        {onBack ? (
          <button 
            onClick={onBack}
            className="text-cyan-400 hover:underline"
          >
            Kembali
          </button>
        ) : (
          <Link to="/hobbies" className="text-cyan-400 hover:underline">
            Kembali ke daftar hobi
          </Link>
        )}
      </div>
    </div>
  );
}