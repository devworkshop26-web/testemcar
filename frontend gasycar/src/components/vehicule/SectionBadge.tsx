import { Badge } from "@/components/ui/badge"

interface SectionBadgeProps {
  text: string
}

export function SectionBadge({ text }: SectionBadgeProps) {
  return (
    <Badge variant="outline" className="rounded-full bg-muted text-xs font-medium uppercase tracking-wide">
      {text}
    </Badge>
  )
}

