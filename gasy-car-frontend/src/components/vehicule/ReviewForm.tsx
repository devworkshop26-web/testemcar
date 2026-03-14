import { useState } from "react";
import { Star, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  onSubmit?: (rating: number, comment: string) => void;
  className?: string;
}

const ReviewForm = ({ onSubmit, className }: ReviewFormProps) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0 && comment.trim()) {
      onSubmit?.(rating, comment);
      setRating(0);
      setComment("");
    }
  };

  const displayRating = hoveredRating || rating;

  const getRatingLabel = (value: number) => {
    const labels: Record<number, string> = {
      1: "Décevant",
      2: "Passable",
      3: "Correct",
      4: "Très bien",
      5: "Excellent",
    };
    return labels[value] || "";
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-5", className)}>
      {/* Rating Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          Votre note <span className="text-destructive">*</span>
        </label>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => {
              const starValue = i + 1;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHoveredRating(starValue)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  <Star
                    className={cn(
                      "w-7 h-7 transition-colors",
                      starValue <= displayRating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted hover:text-amber-200"
                    )}
                  />
                </button>
              );
            })}
          </div>
          
          {displayRating > 0 && (
            <span className="text-sm font-medium text-primary ml-2 animate-fade-in">
              {getRatingLabel(displayRating)}
            </span>
          )}
        </div>
      </div>

      {/* Comment Textarea */}
      <div className="space-y-2">
        <label htmlFor="review-comment" className="text-sm font-medium text-foreground">
          Votre avis <span className="text-destructive">*</span>
        </label>
        <Textarea
          id="review-comment"
          placeholder="Partagez votre expérience avec ce véhicule..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="resize-none bg-muted/30 border-muted focus:border-primary/50 focus:ring-primary/20 transition-all"
        />
        <p className="text-xs text-muted-foreground">
          {comment.length}/500 caractères
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={rating === 0 || !comment.trim()}
        className="w-full sm:w-auto btn-primary gap-2"
      >
        <Send className="w-4 h-4" />
        Publier mon avis
      </Button>
    </form>
  );
};

export default ReviewForm;
