"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import type { TicketMessage } from "@/types/supportTypes";
import type { User } from "@/types/userType";
import { cn } from "@/lib/utils";
import { InstanceAxis } from "@/helper/InstanceAxios";

interface Props {
  messages: TicketMessage[];
  currentUserId: string;
  profilesById: Record<string, User>;
  profilesByEmail: Record<string, User>;
}

const looksLikeEmail = (s: string) => s.includes("@") && s.includes(".");

const toFullName = (u: any) => {
  const full = `${u?.first_name ?? ""} ${u?.last_name ?? ""}`.trim();
  return full || u?.full_name || u?.username || u?.email || "Utilisateur";
};

const resolveImg = (img: any) => {
  if (!img) return null;
  const s = String(img);
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  const BASE = (InstanceAxis.defaults.baseURL || "").replace("/api", "");
  return `${BASE}${s}`;
};

export const ConversationBox: React.FC<Props> = ({
  messages,
  currentUserId,
  profilesById,
  profilesByEmail,
}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const getSenderId = (msg: any): string => {
    const raw =
      msg?.sender_id ??
      msg?.sender?.id ??
      msg?.sender?.user_id ??
      msg?.user_id ??
      msg?.user?.id ??
      msg?.sender ??
      msg?.user ??
      "";
    return raw ? String(raw) : "";
  };

  const getSenderEmail = (msg: any): string => {
    const raw =
      msg?.sender_email ??
      msg?.sender?.email ??
      msg?.user?.email ??
      (typeof msg?.sender === "string" && looksLikeEmail(msg.sender) ? msg.sender : "") ??
      "";
    return raw ? String(raw).trim().toLowerCase() : "";
  };

  const formatTime = (value: any) => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };

  const initials = (name: string) => (name?.trim()?.[0] ?? "U").toUpperCase();

  const resolveProfile = (msg: any) => {
    const senderId = getSenderId(msg);
    const senderEmail = getSenderEmail(msg);

    // 1) backend fournit direct
    const directName = msg?.sender_name ? String(msg.sender_name).trim() : "";
    const directAvatar = msg?.sender_avatar ?? null;

    if (directName || directAvatar) {
      return {
        name: directName || "Utilisateur",
        avatar: resolveImg(directAvatar),
      };
    }

    // 2) resolve via maps
    let u: any = null;

    if (senderId && looksLikeEmail(senderId)) u = profilesByEmail[senderId.toLowerCase()] ?? null;
    if (!u && senderId) u = profilesById[senderId] ?? null;
    if (!u && senderEmail) u = profilesByEmail[senderEmail] ?? null;

    if (u) {
      return {
        name: toFullName(u),
        avatar: resolveImg(u?.image ?? u?.profile_photo ?? u?.avatar_url ?? null),
      };
    }

    // 3) fallback propre (pas email)
    const isSupport = !!(msg?.is_support || msg?.sender_role === "SUPPORT");
    return { name: isSupport ? "Support" : "Utilisateur", avatar: null };
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  return (
    <div className="space-y-3 overflow-x-hidden">
      {messages.map((msg: any, idx: number) => {
        const senderId = getSenderId(msg);
        const isMine = senderId && String(senderId) === String(currentUserId);

        const p = resolveProfile(msg);

        return (
          <div
            key={String(msg?.id ?? `msg-${idx}`)}
            className={cn("flex w-full animate-slide-up", isMine ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "rounded-2xl px-4 py-3 max-w-[70%] text-sm shadow-sm break-words overflow-hidden whitespace-pre-wrap",
                isMine
                  ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-br-sm"
                  : "bg-card border border-border text-foreground rounded-bl-sm"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                {!isMine && (
                  <div className="w-7 h-7 rounded-full bg-muted overflow-hidden flex items-center justify-center shrink-0">
                    {p.avatar ? (
                      <img src={p.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold">{initials(p.name)}</span>
                    )}
                  </div>
                )}
                <p className={cn("text-xs font-semibold", isMine ? "text-primary-foreground/80" : "text-muted-foreground")}>
                  {isMine ? "Vous" : p.name}
                </p>
              </div>

              <p className="break-words whitespace-pre-wrap max-w-full font-medium">{msg?.message}</p>

              <p className={cn("text-xs mt-2 pt-2 border-t", isMine ? "border-primary/30 text-primary-foreground/70" : "border-border text-muted-foreground")}>
                {formatTime(msg?.created_at)}
              </p>
            </div>
          </div>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
};
