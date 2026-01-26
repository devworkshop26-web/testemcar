import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const statusColors: any = {
  OPEN: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-orange-100 text-orange-700",
  RESOLVED: "bg-green-100 text-green-700",
  CLOSED: "bg-gray-200 text-gray-600",
};

const priorityColors: any = {
  LOW: "bg-green-100 text-green-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  HIGH: "bg-orange-200 text-orange-800",
  URGENT: "bg-red-200 text-red-800",
};

export function TicketCard({ ticket }: { ticket: any }) {
  return (
    <Card className="shadow-sm hover:shadow-md transition rounded-xl">
      <CardContent className="p-4 flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
          <MessageSquare />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-lg">{ticket.title}</h3>

            <Badge className={priorityColors[ticket.priority]}>
              {ticket.priority}
            </Badge>
          </div>

          <p className="text-sm text-gray-600">{ticket.description}</p>

          <div className="flex justify-between items-center mt-3">
            <Badge className={statusColors[ticket.status]}>
              {ticket.status.replace("_", " ")}
            </Badge>

            <Link to={`/support/ticket/${ticket.id}`}>
              <span className="text-blue-600 text-sm underline cursor-pointer">
                Voir détails
              </span>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
