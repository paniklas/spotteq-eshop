export const menuVariants = {
  open: {
    clipPath: "inset(0 0 0 0)",
    transition: {
      duration: 0.8,
      ease: [0.76, 0, 0.24, 1],
    }
  },
  closed: {
    clipPath: "inset(0 0 100% 0)",
    transition: {
      duration: 0.8,
      ease: [0.76, 0, 0.24, 1],
    }
  }
};

export const linkVariants = {
  closed: {
    y: "100%",
    opacity: 0,
  },
  open: (index) => ({
    y: 0,
    opacity: 1,
    transition: {
      duration: 1.3,
      ease: [0.76, 0, 0.24, 1],
      delay: 0.6 + index * 0.02,
    }
  }),
  exit: (index) => ({
    y: "100%",
    opacity: 0,
    transition: {
      duration: 0.7,
      ease: [0.76, 0, 0.24, 1],
      delay: (4 - index) * 0.01, // 4 is the number of navigation links
    }
  })
};

export const footerVariants = {
  closed: {
    y: 60,
    opacity: 0,
  },
  open: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 1.5,
      ease: [0.22, 1, 0.36, 1],
      delay: 1.0,
    }
  },
  exit: {
    y: 60,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    }
  }
};
