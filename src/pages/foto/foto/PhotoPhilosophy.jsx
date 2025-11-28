import { motion } from "framer-motion";
import { Sparkles, Camera, Heart, Eye } from "lucide-react";

export default function PhotoPhilosophy() {
  const title = "Filosofi di Balik Lensa".split(" ");
  const philosophyPoints = [
    {
      icon: Camera,
      text: "Setiap foto adalah bentuk komunikasi — tanpa kata, namun penuh makna."
    },
    {
      icon: Heart,
      text: "Momen yang tertangkap adalah cerita yang abadi, terukir dalam waktu."
    },
    {
      icon: Eye,
      text: "Cahaya bukan sekadar alat teknis, tapi bahasa spiritual yang menuntun emosi."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        duration: 0.8
      }
    },
    hover: {
      scale: 1.2,
      rotate: 15,
      transition: {
        duration: 0.3
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.section
      className="mt-12 md:mt-16 lg:mt-24 max-w-4xl mx-auto text-center space-y-8 px-4 w-full"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      {/* Animated Sparkles Icon */}
      <motion.div
        variants={itemVariants}
        className="relative"
      >
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: {
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            },
            scale: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-300 mx-auto" />
        </motion.div>
        
        {/* Floating particles effect */}
        <motion.div
          className="absolute inset-0"
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-2 h-2 bg-yellow-300 rounded-full absolute top-2 left-6 opacity-60" />
          <div className="w-1 h-1 bg-cyan-300 rounded-full absolute bottom-4 right-8 opacity-40" />
          <div className="w-1.5 h-1.5 bg-purple-300 rounded-full absolute top-6 right-4 opacity-50" />
        </motion.div>
      </motion.div>

      {/* Animated Title */}
      <motion.h3
        className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-300 bg-clip-text text-transparent"
        variants={itemVariants}
      >
        {title.map((word, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: "easeOut"
            }}
            className="inline-block mr-2"
          >
            {word}
          </motion.span>
        ))}
      </motion.h3>

      {/* Philosophy Points */}
      <motion.div
        className="space-y-6 mt-8"
        variants={containerVariants}
      >
        {philosophyPoints.map((point, index) => {
          const IconComponent = point.icon;
          return (
            <motion.div
              key={index}
              className="flex items-center justify-start gap-4 p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10"
              variants={itemVariants}
              whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(255,255,255,0.08)",
                transition: { duration: 0.2 }
              }}
            >
              <motion.div
                variants={iconVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true }}
                className="flex-shrink-0"
              >
                <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
              </motion.div>
              
              <motion.p
                variants={textVariants}
                className="text-gray-300 leading-relaxed text-left text-sm sm:text-base md:text-lg"
              >
                {point.text}
              </motion.p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Closing Statement */}
      <motion.div
        variants={itemVariants}
        className="pt-6"
      >
        <motion.p
          className="text-gray-400 italic text-sm sm:text-base md:text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          viewport={{ once: true }}
        >
          "Dalam setiap bidikan, tersimpan jiwa yang berbicara melalui cahaya dan bayangan."
        </motion.p>
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        className="flex justify-center gap-4 mt-8"
        variants={itemVariants}
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-2 h-2 bg-cyan-400 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.3,
            }}
          />
        ))}
      </motion.div>
    </motion.section>
  );
}