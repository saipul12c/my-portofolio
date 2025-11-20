// AboutCards.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import {
  Code2,
  Camera,
  Rocket,
  Sparkles,
  GraduationCap,
  Users,
  Award,
  Heart,
} from "lucide-react";

const iconMap = {
  Code2,
  Camera,
  Rocket,
  Sparkles,
  GraduationCap,
  Users,
  Award,
  Heart,
};

// Mapping warna untuk menghindari class dinamis Tailwind
const colorClasses = {
  pink: {
    border: "border-pink-400/20 hover:border-pink-400",
    text: "group-hover:text-pink-300",
    icon: "text-pink-400",
    gradient: "from-pink-500 via-purple-500 to-indigo-500",
  },
  purple: {
    border: "border-purple-400/20 hover:border-purple-400",
    text: "group-hover:text-purple-300",
    icon: "text-purple-400",
    gradient: "from-purple-500 via-pink-500 to-blue-500",
  },
  blue: {
    border: "border-blue-400/20 hover:border-blue-400",
    text: "group-hover:text-blue-300",
    icon: "text-blue-400",
    gradient: "from-blue-500 via-cyan-500 to-green-500",
  },
  green: {
    border: "border-green-400/20 hover:border-green-400",
    text: "group-hover:text-green-300",
    icon: "text-green-400",
    gradient: "from-green-500 via-emerald-500 to-teal-500",
  },
  yellow: {
    border: "border-yellow-400/20 hover:border-yellow-400",
    text: "group-hover:text-yellow-300",
    icon: "text-yellow-400",
    gradient: "from-yellow-500 via-orange-500 to-red-500",
  },
  indigo: {
    border: "border-indigo-400/20 hover:border-indigo-400",
    text: "group-hover:text-indigo-300",
    icon: "text-indigo-400",
    gradient: "from-indigo-500 via-purple-500 to-pink-500",
  },
};

// Variants untuk animasi
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const imageVariants = {
  hidden: { opacity: 0, x: 80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 20,
      delay: 0.4
    }
  }
};

// Text Generate Effect Component
const TextGenerateEffect = ({ words, className }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < words.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + words[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30);
      
      return () => clearTimeout(timer);
    }
  }, [currentIndex, words]);

  return <span className={className}>{displayedText}</span>;
};

// Evervault Card Component
const EvervaultCard = ({ 
  children, 
  className = "", 
  colors,
  showGradient = true 
}) => {
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  return (
    <div
      ref={cardRef}
      className={`relative rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Animated gradient border */}
      {showGradient && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(120,119,198,0.15), transparent 40%)`,
          }}
        />
      )}
      
      {/* Dynamic border gradient */}
      <div
        className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 ${
          isHovering ? 'blur-xl' : 'blur-0'
        }`}
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, ${
            colors ? `rgba(120,119,198,0.3)` : 'rgba(255,255,255,0.1)'
          }, transparent 40%)`,
        }}
      />
      
      {/* Main content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
      
      {/* Shine effect */}
      <div
        className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
          isHovering ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1), transparent 40%)`,
        }}
      />
    </div>
  );
};

// Hover Effect Component
const HoverEffect = ({ 
  children, 
  className = "",
  intensity = 1 
}) => {
  const [transform, setTransform] = useState("translateX(0px) translateY(0px)");
  const [opacity, setOpacity] = useState(0);
  
  const handleMouseMove = (e) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const rotateY = (-1 / 5) * x + 20;
    const rotateX = (4 / 30) * y - 20;
    
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1, 1, 1)`);
    setOpacity(1);
  };
  
  const handleMouseLeave = () => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setOpacity(0);
  };

  return (
    <div
      className={`transition-all duration-200 ease-out ${className}`}
      style={{ 
        transform,
        opacity: 1
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          opacity,
          background: `radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), 
            rgba(255,255,255,0.06), transparent 40%)`,
        }}
      />
    </div>
  );
};

export default function AboutCards({ cards, imageSrc }) {
  return (
    <section className="mt-16 flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl mx-auto gap-10 px-4">
      {/* Bagian Kiri - Kartu */}
      <motion.div
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 flex-1"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {cards.map((card, i) => {
          const Icon = iconMap[card.icon];
          const colors = colorClasses[card.color] || colorClasses.pink;
          
          return (
            <motion.div
              key={i}
              variants={cardVariants}
              className={`group ${card.id === 3 ? "sm:col-span-2 lg:col-span-1" : ""}`}
            >
              <Link
                to={card.link}
                className="block h-full focus:outline-none focus:ring-2 focus:ring-white/50 rounded-2xl"
              >
                <HoverEffect className="h-full">
                  <EvervaultCard 
                    className="h-full p-8 transition-all duration-300 group-hover:scale-[1.02]"
                    colors={colors}
                  >
                    <div className="flex flex-col h-full">
                      {Icon && (
                        <Icon 
                          className={`w-10 h-10 ${colors.icon} mb-4 transition-all duration-300 group-hover:scale-110`} 
                        />
                      )}
                      
                      <h2 className={`text-xl font-semibold mb-3 ${colors.text} transition-colors duration-300`}>
                        <TextGenerateEffect 
                          words={card.title} 
                          className="inline-block" 
                        />
                      </h2>

                      {card.type === "list" ? (
                        <ul className="text-gray-300 text-sm space-y-2 flex-1">
                          {card.content.map((item, idx) => (
                            <li key={idx} className="flex items-start transition-all duration-300 group-hover:translate-x-1">
                              <span className={`${colors.icon} mr-2 mt-1`}>•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-300 text-sm leading-relaxed flex-1">
                          <TextGenerateEffect 
                            words={card.content} 
                            className="inline-block" 
                          />
                        </p>
                      )}
                      
                      {/* Animated arrow indicator */}
                      <div className="mt-4 flex items-center justify-between">
                        <div className={`w-6 h-6 ${colors.icon} transform group-hover:translate-x-2 transition-all duration-300 opacity-0 group-hover:opacity-100`}>
                          →
                        </div>
                        <div className="flex-1 border-t border-white/20 group-hover:border-white/40 transition-colors duration-300 ml-4" />
                      </div>
                    </div>
                  </EvervaultCard>
                </HoverEffect>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Bagian Kanan - Foto */}
      {imageSrc && (
        <motion.div
          className="relative flex-shrink-0 w-full max-w-sm lg:max-w-md"
          variants={imageVariants}
          initial="hidden"
          animate="visible"
        >
          <HoverEffect className="rounded-3xl">
            <div className="relative rounded-3xl shadow-2xl overflow-hidden border border-white/20 bg-gradient-to-br from-white/5 to-white/10">
              <img
                src={imageSrc}
                alt="About Illustration"
                className="w-full h-auto object-cover transition-transform duration-700"
                loading="lazy"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/10 to-black/20" />
            </div>
          </HoverEffect>
          
          {/* Enhanced decorative effects */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-pink-500/30 via-purple-500/20 to-indigo-500/20 blur-3xl -z-10 animate-pulse-slow" />
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-xl -z-5 opacity-60" />
          <div className="absolute inset-0 rounded-3xl border border-white/5 -z-1" />
        </motion.div>
      )}
    </section>
  );
}