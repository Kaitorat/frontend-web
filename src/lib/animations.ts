export const P5_TRANSITION = {
  // Un "snap" rápido. Entra muy rápido y frena de golpe.
  duration: 0.3,
  ease: [0.16, 1, 0.3, 1], // Cubic bezier personalizado
};

export const P5_AGGRESSIVE_TRANSITION = {
  // Para cosas como el "Take Your Time" o alertas críticas
  duration: 0.2,
  ease: "circOut",
};

// Variantes para Framer Motion
export const slideInVariant = {
  hidden: { x: -100, opacity: 0, skewX: 10 },
  visible: { 
    x: 0, 
    opacity: 1, 
    skewX: 0,
    transition: { 
      duration: P5_TRANSITION.duration, 
      ease: P5_TRANSITION.ease as [number, number, number, number]
    }
  },
  exit: { 
    x: 100, 
    opacity: 0, 
    transition: { duration: 0.1 } // Salida instantánea
  }
};

export const slideInFromRight = {
  hidden: { x: 100, opacity: 0, skewX: -10 },
  visible: { 
    x: 0, 
    opacity: 1, 
    skewX: 0,
    transition: { 
      duration: P5_TRANSITION.duration, 
      ease: P5_TRANSITION.ease as [number, number, number, number]
    }
  },
  exit: { 
    x: -100, 
    opacity: 0, 
    transition: { duration: 0.1 }
  }
};

export const fadeInUp = {
  hidden: { y: 50, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: P5_TRANSITION.duration, 
      ease: P5_TRANSITION.ease as [number, number, number, number]
    }
  },
  exit: { 
    y: -50, 
    opacity: 0, 
    transition: { duration: 0.1 }
  }
};

export const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: P5_TRANSITION 
  },
  exit: { 
    scale: 0.8, 
    opacity: 0, 
    transition: { duration: 0.1 }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
};

export const staggerItem = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: P5_TRANSITION.duration, 
      ease: P5_TRANSITION.ease as [number, number, number, number]
    }
  }
};

export const pulseGlow = {
  animate: {
    boxShadow: [
      "0 0 20px rgba(217, 26, 26, 0.3)",
      "0 0 40px rgba(217, 26, 26, 0.5)",
      "0 0 20px rgba(217, 26, 26, 0.3)",
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const rotateIn = {
  hidden: { rotate: -180, opacity: 0, scale: 0.5 },
  visible: { 
    rotate: 0, 
    opacity: 1, 
    scale: 1,
    transition: P5_TRANSITION 
  }
};
