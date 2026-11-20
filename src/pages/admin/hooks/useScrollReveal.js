import { useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export const useScrollReveal = (delay = 0) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ 
    triggerOnce: true, 
    threshold: 0.05,
    rootMargin: "0px 0px -30px 0px"
  });

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
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0, 
        transition: { 
          duration: 0.45, 
          delay,
          ease: "easeOut"
        } 
      },
    },
  };
};
