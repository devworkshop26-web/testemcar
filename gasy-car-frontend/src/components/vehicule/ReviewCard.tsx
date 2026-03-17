import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
  firstName: string;
  lastName: string;
  photoUrl?: string;
  rating: number;
  date: string;
  comment: string;
  className?: string;
}

const ReviewCard = ({
  firstName,
  lastName,
  photoUrl,
  rating,
  date,
  comment,
  className,
}: ReviewCardProps) => {
  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();

  return (
    <article className={cn("group", className)}>
      <div className="flex items-start gap-4">
        {/* Avatar */}
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={`${firstName} ${lastName}`}
            className="w-12 h-12 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-muted-foreground font-medium shrink-0">
            {initials}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <h4 className="font-semibold text-foreground">
              {firstName} {lastName}
            </h4>
            <time className="text-xs text-muted-foreground">{date}</time>
          </div>

          {/* Rating Stars */}
          <div className="flex items-center gap-0.5 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3.5 h-3.5",
                  i < rating
                    ? "fill-amber-400 text-amber-400"
                    : "fill-muted text-muted"
                )}
              />
            ))}
          </div>

          {/* Comment */}
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            {comment}
          </p>
        </div>
      </div>
    </article>
  );
};

export default ReviewCard;
