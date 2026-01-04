import { useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export const useScrollReveal = (delay = 0) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return {
    ref,
    animate: controls,
    initial: "hidden",
    variants: {
      hidden: { opacity: 0, y: 60, scale: 0.95 },
      visible: { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        transition: { 
          duration: 0.8, 
          delay,
          ease: [0.25, 0.46, 0.45, 0.94]
        } 
      },
    },
  };
};