import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

const SHOW_BUTTON_AFTER = 220;

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > SHOW_BUTTON_AFTER);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 bg-primary text-primary-foreground shadow-lg transition hover:scale-105 hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      aria-label="Retour en haut"
      title="Retour en haut"
    >
      <ChevronUp className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
