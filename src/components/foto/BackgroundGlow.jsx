export default function BackgroundGlow() {
  return (
    <div className="absolute inset-0 -z-10">
      <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl animate-pulse" />
    </div>
  );
}
