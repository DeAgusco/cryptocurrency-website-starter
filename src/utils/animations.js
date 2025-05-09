// Framer Motion variants for consistent animations across components

// Fade up animation - good for content sections
export const fadeUpVariant = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

// Fade up with delay based on custom index
export const staggerFadeUpVariant = {
  hidden: { y: 30, opacity: 0 },
  visible: (i = 0) => ({
    y: 0,
    opacity: 1,
    transition: { 
      delay: 0.05 * i,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

// Subtle scale animation - good for cards and buttons
export const scaleVariant = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.4 }
  }
};

// Horizontal slide animation - good for sidebars and drawers
export const slideHorizontalVariant = {
  hidden: (fromRight = true) => ({ 
    x: fromRight ? 50 : -50, 
    opacity: 0 
  }),
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4 }
  }
};

// Container variant with staggered children animations
export const containerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Pulse animation - good for highlights
export const pulseVariant = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      yoyo: Infinity,
      ease: "easeInOut"
    }
  }
};

// Letter animation - reveals text letter by letter
export const letterVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.1 }
  }
};

// Path drawing animation - good for SVG icons
export const pathVariant = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1, ease: "easeInOut" }
  }
};

// Float animation - good for background elements
export const floatVariant = {
  hidden: { y: 0 },
  visible: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut"
    }
  }
};

// Page transitions
export const pageVariant = {
  hidden: { opacity: 0 },
  enter: { 
    opacity: 1,
    transition: { duration: 0.5, ease: [0.48, 0.15, 0.25, 0.96] }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2, ease: [0.48, 0.15, 0.25, 0.96] }
  }
}; 