export default function BackgroundGlow() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none select-none overflow-hidden" aria-hidden="true">
      <div className="absolute top-1/4 left-[10%] w-60 h-60 bg-cyan-400/10 rounded-full blur-[80px] transform-gpu will-change-transform" />
      <div className="absolute bottom-1/3 right-[10%] w-64 h-64 bg-purple-400/10 rounded-full blur-[90px] transform-gpu will-change-transform" />
    </div>
  );
}