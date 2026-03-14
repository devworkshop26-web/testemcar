// src/components/ui/Loading.tsx

import React from "react";

export default function Loading() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded-full animate-bounce bg-blue-500"></div>
      <div className="w-4 h-4 rounded-full animate-bounce bg-blue-500 animation-delay-200"></div>
      <div className="w-4 h-4 rounded-full animate-bounce bg-blue-500 animation-delay-400"></div>
    </div>
  );
}
