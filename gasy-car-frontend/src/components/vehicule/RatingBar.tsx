import { cn } from "@/lib/utils";

interface RatingBarProps {
  label: string;
  value: number;
  maxValue?: number;
  className?: string;
}

const RatingBar = ({ label, value, maxValue = 5, className }: RatingBarProps) => {
  const percentage = (value / maxValue) * 100;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="text-sm text-muted-foreground w-32 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm font-medium w-8 text-right">{value.toFixed(1)}</span>
    </div>
  );
};

export default RatingBar;
