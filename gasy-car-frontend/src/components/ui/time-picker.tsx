"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function TimePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (time: string) => void;
}) {
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  const minutes = ["00", "15", "30", "45"];

  return (
    <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent p-2 rounded-xl border border-slate-200 bg-white">
      {hours.map((h) =>
        minutes.map((m) => {
          const t = `${h}:${m}`;
          return (
            <div
              key={t}
              onClick={() => onChange(t)}
              className={cn(
                "px-4 py-2 cursor-pointer rounded-lg text-sm",
                t === value
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-slate-100 text-slate-700"
              )}
            >
              {t}
            </div>
          );
        })
      )}
    </div>
  );
}
