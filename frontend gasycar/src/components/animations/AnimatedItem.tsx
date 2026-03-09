import { ReactNode } from "react";
import { useScrollAnimation } from "./useScrollAnimation";

interface AnimatedItemProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Composant pour animer les cartes/éléments individuels avec un délai.
 * Utilise le même hook et style que AnimatedSection pour la cohérence.
 */
export const AnimatedItem: React.FC<AnimatedItemProps> = ({ 
  children, 
  delay = 0,
  className = ""
}) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 transform ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
};
