"use client";

import Lenis from "lenis";
import { useEffect, useRef } from "react";

function isSupported() {
  // Check for requestAnimationFrame and CSS scroll-behavior support
  return (
    typeof window !== "undefined" &&
    'requestAnimationFrame' in window &&
    'scrollBehavior' in document.documentElement.style
  );
}

function SmoothScrolling({ children }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isSupported()) {
      const lenis = new Lenis();

      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };

      requestAnimationFrame(raf);

      function onResize() {
        lenis.resize();
      }
    
      window.addEventListener('resize', onResize);
    
      return () => {
        lenis.destroy();
        window.removeEventListener('resize', onResize);
      };
    } else {
      console.warn('Smooth scrolling is not supported');
      // Fallback: Enable CSS-based smooth scrolling for modern browsers that support it
      document.documentElement.style.scrollBehavior = 'smooth';
    }
  }, []);

  return <div ref={ref}>{children}</div>;
}

export default SmoothScrolling;
