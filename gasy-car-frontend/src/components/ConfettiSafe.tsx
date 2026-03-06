// src/components/ConfettiSafe.tsx
const ConfettiSafe = ({ active = false }: { active?: boolean }) => {
  if (!active) return null;

  const pieces = Array.from({ length: 50 });

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[999] overflow-hidden">
        {pieces.map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-safe-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20}px`,
              backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
              animationDuration: `${2 + Math.random() * 1.8}s`,
              animationDelay: `${Math.random() * 0.3}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes safeConfetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-safe-confetti {
          animation: safeConfetti linear forwards;
        }
      `}</style>
    </>
  );
};

export default ConfettiSafe;
