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

  const submit = () => {
    if (disabled) return;
    const value = text.trim();
    if (!value) return;

    setText("");
    onSend(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "rounded-3xl border bg-white p-3 shadow-sm transition-all",
        isFocused
          ? "border-blue-300 ring-4 ring-blue-100"
          : "border-slate-200"
      )}
    >
      <div className="flex items-end gap-3">
        <textarea
          value={text}
          disabled={disabled}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Écrire votre message…"
          rows={1}
          className="min-h-[48px] flex-1 resize-none bg-transparent px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20 transition-all hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Envoyer le message"
        >
          <SendHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-2 flex items-center justify-between px-1 text-[11px] text-slate-500">
        <span>Entrée pour envoyer · Maj + Entrée pour une nouvelle ligne</span>
        <span>{text.trim().length > 0 ? `${text.trim().length} caractères` : ""}</span>
      </div>
    </form>
  );
}