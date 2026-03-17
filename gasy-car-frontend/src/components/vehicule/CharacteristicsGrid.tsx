import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CharacteristicItem {
  icon: LucideIcon;
  label: string;
  value: string | number;
}

interface CharacteristicsGridProps {
  items: CharacteristicItem[];
  className?: string;
}

const CharacteristicsGrid = ({ items, className }: CharacteristicsGridProps) => {
  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2", className)}>
      {items.map((item, idx) => (
        <div
          key={idx}
          className="flex items-center gap-2.5 p-2.5 bg-muted/40 hover:bg-muted/60 rounded-lg transition-colors group"
        >
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
            <item.icon className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
              {item.label}
            </p>
            <p className="text-[13px] font-medium font-poppins text-foreground truncate">
              {item.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CharacteristicsGrid;
