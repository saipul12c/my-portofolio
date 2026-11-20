import { memo } from "react";
import {
  Camera,
  BookOpen,
  Film,
  PenTool,
  PenSquare,
  Headphones,
  Compass,
  Laptop,
  Globe,
  Code,
  Music,
  Heart,
  BookMarked,
  Cpu,
  Palette,
  Pen,
  Users,
  Book,
  Map,
  Sparkles
} from "lucide-react";

const ICON_MAP = {
  Camera,
  BookOpen,
  Film,
  PenTool,
  PenSquare,
  Headphones,
  Compass,
  Laptop,
  Globe,
  Code,
  Music,
  Heart,
  BookMarked,
  Cpu,
  Palette,
  Pen,
  Users,
  Book,
  Map,
  Sparkles
};

function HobbyIcon({ name, size = 24, className = "" }) {
  const IconComponent = (name && ICON_MAP[name]) || Sparkles;
  return <IconComponent size={size} className={className} />;
}

export default memo(HobbyIcon);
