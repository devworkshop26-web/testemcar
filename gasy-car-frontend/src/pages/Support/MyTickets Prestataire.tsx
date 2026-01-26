"use client"

import { useSupportQuery } from "@/useQuery/supportUseQuery"
import { useQueryClient } from "@tanstack/react-query"
import type { User } from "@/types/userType"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

import { Loader2, MessageSquare, Search, Plus, Calendar, Filter, ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"
import { useState } from "react"
import { useUnreadTickets } from "@/hooks/support/useUnreadTickets"
import { useTicketsListSocket } from "@/hooks/support/useTicketsListSocket"

export default function MyTickets() {
  // ---------------------------
  // Hooks (toujours tout en haut)
  // ---------------------------
  const queryClient = useQueryClient()
  const currentUser = queryClient.getQueryData<User>(["currentUser"])
  const { ticketsData } = useSupportQuery()
  const { unreadTickets } = useUnreadTickets()
  useTicketsListSocket()

  const [search, setSearch] = useState("")
  const [dateFilter, setDateFilter] = useState("all") // Updated default value to "all"
  const [page, setPage] = useState(1)
  const itemsPerPage = 6

  // ---------------------------
  // Loading
  // ---------------------------
  if (!ticketsData) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  // ---------------------------
  // Data filtering (NO HOOKS INSIDE)
  // ---------------------------

  // 1. Tickets du user
  const myTickets = ticketsData.filter((t) => t.user === currentUser?.id)

  // 2. Filtre search
  let filtered = myTickets.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))

  // 3. Filtre date
  filtered = filtered.filter((ticket) => {
    if (dateFilter === "all") return true

    const created = new Date(ticket.created_at)
    const now = new Date()

    if (dateFilter === "today") {
      return created.toDateString() === now.toDateString()
    }

    if (dateFilter === "week") {
      const weekAgo = new Date()
      weekAgo.setDate(now.getDate() - 7)
      return created >= weekAgo
    }

    if (dateFilter === "month") {
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
    }

    if (dateFilter === "year") {
      return created.getFullYear() === now.getFullYear()
    }

    return true
  })

  // ---------------------------
  // Pagination
  // ---------------------------
  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const start = (page - 1) * itemsPerPage
  const paginated = filtered.slice(start, start + itemsPerPage)

  return (
    <div className="min-h-screen bg-background rounded-3xl overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-950 to-slate-900 text-white px-6 py-12 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Mes Tickets Support</h1>
              <p className="text-slate-300 text-lg">
                {filtered.length} ticket{filtered.length !== 1 ? "s" : ""} trouvé{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>

            <Link to="/prestataire/supports/create">
              <Button className="bg-primary hover:bg-primary/90 text-white gap-2 px-6 py-6 text-base rounded-lg">
                <Plus className="w-5 h-5" />
                Nouveau Ticket
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8 md:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Filters Section - Parent modifié en rounded-3xl */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 mb-8 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-slate-600" />
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Filtres</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search Input */}
              <div className="relative">
                {/* Icon centrée avec top-1/2 et translate */}
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Rechercher par titre..."
                  /* Ajout de h-12 pour la hauteur et rounded-2xl */
                  className="pl-11 h-12 bg-slate-50 border-slate-300 focus:bg-white text-sm rounded-2xl"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                />
              </div>

              {/* Date Filter */}
              <Select
                value={dateFilter}
                onValueChange={(v) => {
                  setPage(1)
                  setDateFilter(v)
                }}
              >
                {/* Ajout de h-12 pour la hauteur et rounded-2xl */}
                <SelectTrigger className="h-12 bg-slate-50 border-slate-300 focus:bg-white rounded-2xl">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <SelectValue placeholder="Toutes les périodes" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">Toutes les périodes</SelectItem> 
                  <SelectItem value="today">Aujourd'hui</SelectItem>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                  <SelectItem value="year">Cette année</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Empty State */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-600 text-lg mb-2">Aucun ticket trouvé</p>
              <p className="text-slate-400 text-sm">Essayez de modifier vos filtres ou créez un nouveau ticket</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {paginated.map((ticket) => (
                <Link key={ticket.id} to={`/prestataire/supports/ticket/${ticket.id}`} className="group">
                  <Card className="h-full shadow-sm hover:shadow-lg border-slate-200 transition-all duration-300 hover:border-primary/30 cursor-pointer">
                    <CardContent className="p-6 flex flex-col h-full">
                      {/* Header avec Icon et Badge */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 text-white flex items-center justify-center rounded-lg group-hover:scale-110 transition-transform duration-300">
                          <MessageSquare className="w-6 h-6" />
                        </div>

                        {unreadTickets.includes(ticket.id) && (
                          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-700 border border-red-200">
                            Nouveau
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {ticket.title}
                      </h3>

                      {/* Description */}
                      <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-grow">{ticket.description}</p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <span className="text-xs text-slate-500 font-medium">
                          {new Date(ticket.created_at).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>

                        <div className="flex items-center gap-1 text-primary group-hover:gap-2 transition-all text-sm font-semibold">
                          Voir
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="border-slate-300 hover:bg-slate-50 rounded-lg"
              >
                ← Précédent
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all ${
                      p === page ? "bg-primary text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="border-slate-300 hover:bg-slate-50 rounded-lg"
              >
                Suivant →
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}