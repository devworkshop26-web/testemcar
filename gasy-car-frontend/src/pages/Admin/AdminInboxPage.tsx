// src/pages/admin/AdminInboxPage.tsx
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AdminPageShell } from "@/components/admin/AdminPageShell"
import { cn } from "@/lib/utils"
import { useSupportQuery } from "@/useQuery/supportUseQuery"

export function AdminInboxPage() {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)

  // tous les tickets
  const { ticketsData } = useSupportQuery()

  // détail ticket + messages (hooks dynamiques)
  const ticketDetailQuery = selectedTicketId
    ? useSupportQuery().getTicketDetail(selectedTicketId)
    : null

  const ticketMessagesQuery = selectedTicketId
    ? useSupportQuery().getTicketMessages(selectedTicketId)
    : null

  return (
    <AdminPageShell
      title="Inbox & Support"
      description="Gérez les conversations et tickets des utilisateurs."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

        {/** -------------------------- */}
        {/** Liste des Tickets */}
        {/** -------------------------- */}
        <Card className="bg-white shadow-sm lg:col-span-1">
          <CardHeader className="space-y-1">
            <CardTitle className="text-base sm:text-lg">Tickets récents</CardTitle>
            <p className="text-sm text-muted-foreground">
              Sélectionnez un ticket pour afficher la conversation.
            </p>
          </CardHeader>

          <CardContent className="space-y-3">
            {!ticketsData && <p className="text-sm">Chargement…</p>}

            {ticketsData?.length === 0 && (
              <p className="text-sm text-muted-foreground">Aucun ticket trouvé.</p>
            )}

            <div className="space-y-2 overflow-y-auto rounded-lg bg-muted/30 p-2 sm:max-h-[520px]">
              {ticketsData?.map((ticket) => (
                <button
                  key={ticket.id}
                  type="button"
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={cn(
                    "flex w-full cursor-pointer items-start justify-between gap-3 rounded-xl border bg-white p-3 text-left shadow-sm transition hover:border-primary/50 hover:bg-primary/5",
                    selectedTicketId === ticket.id && "border-primary bg-primary/5"
                  )}
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground sm:text-base">{ticket.title}</p>
                    <p className="text-xs text-muted-foreground sm:text-sm">
                      Client : {ticket.user} • Ticket ID : {ticket.id}
                    </p>
                  </div>

                  <Badge variant="outline" className="shrink-0 text-xs">
                    {ticket.status === "OPEN" && "Ouvert"}
                    {ticket.status === "IN_PROGRESS" && "En cours"}
                    {ticket.status === "RESOLVED" && "Résolu"}
                    {ticket.status === "CLOSED" && "Fermé"}
                  </Badge>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/** -------------------------- */}
        {/** Zone détail + messages */}
        {/** -------------------------- */}
        <Card className="bg-white shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-base sm:text-lg">Détail conversation</CardTitle>
            <Button variant="outline" size="sm" disabled={!selectedTicketId}>
              Ouvrir dans la messagerie
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">

            {!selectedTicketId && (
              <p className="text-sm text-muted-foreground">
                Sélectionnez un ticket pour afficher les détails et la conversation.
              </p>
            )}

            {selectedTicketId && ticketDetailQuery?.data && (
              <>
                <div className="rounded-xl border bg-muted/30 p-3 sm:p-4">
                  <p className="font-medium">{ticketDetailQuery.data.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {ticketDetailQuery.data.description}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge variant="outline">
                      {ticketDetailQuery.data.ticket_type}
                    </Badge>
                    <Badge>{ticketDetailQuery.data.priority}</Badge>
                  </div>
                </div>

                <div className="max-h-[320px] space-y-2 overflow-y-auto pr-1 sm:pr-2">
                  {ticketMessagesQuery?.data?.map((msg) => (
                    <div key={msg.id} className="rounded-lg border bg-muted/40 p-2 sm:p-3">
                      <p className="text-xs text-muted-foreground">
                        {msg.sender}
                      </p>
                      <p className="text-sm sm:text-base">{msg.message}</p>
                    </div>
                  ))}

                  {ticketMessagesQuery?.data?.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Aucun message dans cette conversation.
                    </p>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminPageShell>
  )
}
