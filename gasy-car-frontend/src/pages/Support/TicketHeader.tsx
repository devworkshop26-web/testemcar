"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, UserIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAllUsers } from "@/useQuery/useAllUsers"
import type { SupportTicket } from "@/types/supportTypes"
import type { User } from "@/types/userType"

const statusColors: Record<string, string> = {
  OPEN: "bg-blue-100/80 text-blue-700 border border-blue-200",
  IN_PROGRESS: "bg-orange-100/80 text-orange-700 border border-orange-200",
  RESOLVED: "bg-emerald-100/80 text-emerald-700 border border-emerald-200",
  CLOSED: "bg-slate-100/80 text-slate-600 border border-slate-200",
}

interface TicketHeaderProps {
  ticket: SupportTicket
  user?: User | null
}

export function TicketHeader({ ticket, user }: TicketHeaderProps) {
  const navigate = useNavigate()
  const { data: users } = useAllUsers()

  const getUserName = (id: string) => {
    if (user && user.id === id) {
      return `${user.first_name} ${user.last_name}`
    }
    const u = (users as User[])?.find((x) => x.id === id)
    return u ? `${u.first_name} ${u.last_name}` : "Utilisateur inconnu"
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200 group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 duration-200" />
        <span>Retour</span>
      </button>

      <Card className="bg-gradient-to-br from-background to-muted/30 border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-6 space-y-5">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">{ticket.title}</h2>
            <div className="h-1 w-12 bg-gradient-to-r from-primary to-accent rounded-full" />
          </div>

          <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground">Utilisateur</p>
              <p className="text-base font-semibold text-foreground truncate">{getUserName(ticket.user)}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Description</p>
            <p className="text-sm leading-relaxed text-foreground/80">{ticket.description}</p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Statut</p>
              <Badge className={`${statusColors[ticket.status]} font-medium border-0 px-3 py-1`}>
                {ticket.status.replace("_", " ")}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground font-mono bg-muted/50 px-3 py-1 rounded">
              #{ticket.id.slice(0, 8)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
