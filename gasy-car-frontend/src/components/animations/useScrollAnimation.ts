import { useRef, useState, useEffect } from "react";

/**
 * Hook personnalisé pour déclencher des animations au scroll
 * Utilise IntersectionObserver pour détecter quand un élément devient visible
 */
export const useScrollAnimation = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Déclenche l'animation une seule fois
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.05, // Déclencher dès que 5% est visible
        rootMargin: "0px 0px -100px 0px", // Charger un peu plus tôt
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [isVisible]);

  return { ref, isVisible };
};
