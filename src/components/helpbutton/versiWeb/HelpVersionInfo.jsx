import { Info } from "lucide-react";

export default function HelpVersionInfo() {
  const versiWebsite = "v1.2.5"; // 💡 sesuaikan di sini

  return (
    <li className="flex items-center justify-between text-gray-400 text-xs px-1">
      <span className="flex items-center gap-1">
        <Info size={12} />
        Versi Website
      </span>
      <span className="text-white font-mono">{versiWebsite}</span>
    </li>
  );
}
