"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import { Paperclip, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { InstanceAxis } from "@/helper/InstanceAxios";
import type { TicketMessage } from "@/types/supportTypes";
import type { User } from "@/types/userType";

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

  const formatTime = (value: string) => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const initials = (name: string) => {
    const parts = (name || "U").trim().split(" ").filter(Boolean);
    return `${parts[0]?.[0] ?? "U"}${parts[1]?.[0] ?? ""}`.toUpperCase();
  };

  const resolveProfile = (msg: any) => {
    const senderId = getSenderId(msg);
    const senderEmail = getSenderEmail(msg);

    const directName = msg?.sender_name ? String(msg.sender_name).trim() : "";
    const directAvatar = msg?.sender_avatar ?? null;

    if (directName || directAvatar) {
      return {
        name: directName || "Utilisateur",
        avatar: resolveImg(directAvatar),
      };
    }

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

    const isSupport = msg?.sender_role === "SUPPORT" || msg?.sender_role === "ADMIN" || msg?.is_support;
    return {
      name: isSupport ? "Support" : "Utilisateur",
      avatar: null,
    };
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  return (
    <div className="space-y-4">
      {messages.map((msg: any, idx: number) => {
        const senderId = getSenderId(msg);
        const isMine = senderId && String(senderId) === String(currentUserId);
        const profile = resolveProfile(msg);
        const isSupport = msg?.sender_role === "SUPPORT" || msg?.sender_role === "ADMIN" || msg?.is_support;

        return (
          <div
            key={String(msg?.id ?? `msg-${idx}`)}
            className={cn("flex w-full", isMine ? "justify-end" : "justify-start")}
          >
            <div className={cn("max-w-[85%] md:max-w-[75%]", isMine ? "items-end" : "items-start")}>
              <div className={cn("mb-1 flex items-center gap-2 px-1", isMine ? "justify-end" : "justify-start")}>
                {!isMine && (
                  <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
                    ) : (
                      initials(profile.name)
                    )}
                  </div>
                )}

                <span className="text-xs font-semibold text-slate-700">
                  {isMine ? "Vous" : profile.name}
                </span>

                {isSupport && !isMine && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-700">
                    <Shield className="h-3 w-3" />
                    Support
                  </span>
                )}

                {msg?.is_internal && (
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700">
                    Interne
                  </span>
                )}
              </div>

              <div
                className={cn(
                  "overflow-hidden rounded-3xl border px-4 py-3 shadow-sm",
                  isMine
                    ? "rounded-br-md border-blue-600 bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
                    : "rounded-bl-md border-slate-200 bg-white text-slate-900"
                )}
              >
                <p className="whitespace-pre-wrap break-words text-sm leading-6">
                  {msg?.message}
                </p>

                {msg?.attachment_url && (
                  <a
                    href={msg.attachment_url}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      "mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
                      isMine
                        ? "bg-white/15 text-white hover:bg-white/20"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    )}
                  >
                    <Paperclip className="h-3.5 w-3.5" />
                    Pièce jointe
                  </a>
                )}

                <div
                  className={cn(
                    "mt-3 border-t pt-2 text-[11px]",
                    isMine
                      ? "border-white/15 text-white/80"
                      : "border-slate-200 text-slate-500"
                  )}
                >
                  {formatTime(msg?.created_at)}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
};