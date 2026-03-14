"use client";

import type React from "react";
import { useState } from "react";
import { SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export function MessageInput({
  onSend,
  disabled = false,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;

    const msg = text.trim();
    if (!msg) return;

    setText(""); // UI instantanée
    onSend(msg); // le parent gère optimistic + websocket
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex items-center gap-3 p-4 rounded-2xl border transition-all duration-300",
        isFocused
          ? "border-primary bg-card shadow-lg ring-2 ring-primary/20"
          : "border-border bg-background"
      )}
    >
      <input
        type="text"
        value={text}
        disabled={disabled}
        onChange={(e) => setText(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Écrire un message..."
        className="flex-1 px-4 py-2 bg-transparent text-foreground placeholder-muted-foreground outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-200"
      />

      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="p-2.5 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-xl hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
        aria-label="Send message"
      >
        <SendHorizontal className="h-5 w-5" />
      </button>
    </form>
  );
}
