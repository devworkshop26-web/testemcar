"use client"

import { useParams } from "react-router-dom"
import { useRef, useEffect, useMemo } from "react"

import { useTicketDetail } from "@/useQuery/support/useTicketDetail"
import { useTicketMessages } from "@/useQuery/support/useTicketMessages"
import { useSendMessage } from "@/useQuery/support/useSendMessage"
import { useAllUsers } from "@/useQuery/useAllUsers"
import type { User } from "@/types/userType"

import { Loader2 } from "lucide-react"
import { TicketHeader } from "@/pages/Support/TicketHeader"
import { ConversationBox } from "@/components/support/ConversationBox"
import { MessageInput } from "@/components/support/MessageInput"
import { useTicketSocket } from "@/hooks/support/useTicketSocket"

export default function TicketDetailsPrestataire() {
  const { id } = useParams()
  const ticketId = id

  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })

  const { data: ticket, isLoading: loadingTicket } = useTicketDetail(ticketId)
  const { data: messages, isLoading: loadingMessages } = useTicketMessages(ticketId)
  const { data: users } = useAllUsers()
  const { mutate: sendMessage, isPending: sending } = useSendMessage()

  const loading = loadingTicket || loadingMessages

  useEffect(() => scrollToBottom(), [messages])

  const ticketUser = useMemo(() => {
    if (!ticket || !users) return null
    return (users as User[]).find((u) => u.id === ticket.user) || null
  }, [ticket, users])

  const onSend = (text: string) => {
    if (!text.trim()) return
    sendMessage({ ticket: ticketId, message: text }, { onSuccess: () => setTimeout(scrollToBottom, 50) })
  }

  useTicketSocket(ticketId)

  if (!ticketId)
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-3">
          <div className="text-red-500 text-lg font-semibold">Ticket introuvable</div>
          <p className="text-sm text-muted-foreground">Impossible de charger ce ticket support</p>
        </div>
      </div>
    )

  if (loading)
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-primary w-8 h-8" />
          <p className="text-sm text-muted-foreground">Chargement du ticket...</p>
        </div>
      </div>
    )

  if (!ticket)
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-3">
          <div className="text-lg font-semibold text-foreground">Ticket introuvable</div>
          <p className="text-sm text-muted-foreground">Ce ticket n'existe pas ou a été supprimé</p>
        </div>
      </div>
    )

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gradient-to-b from-background to-muted/10 rounded-2xl border border-border/50 shadow-sm">
      <div className="border-b border-border/50 p-6 bg-background/50 backdrop-blur-sm animate-fade-in">
        <TicketHeader ticket={ticket} user={ticketUser} />
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-background/50 to-muted/5 space-y-4">
        <ConversationBox messages={messages ?? []} currentUserId={ticket.user} />
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-border/50 p-6 bg-background/50 backdrop-blur-sm">
        <MessageInput disabled={sending} onSend={onSend} />
      </div>
    </div>
  )
}
