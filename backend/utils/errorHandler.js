export function errorHandler(err, req, res, next) {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({ message: "Terjadi kesalahan di server", error: err.message });
}
