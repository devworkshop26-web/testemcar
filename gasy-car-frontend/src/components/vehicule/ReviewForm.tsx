import { useState } from "react";
import { Send, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  onSubmit?: (rating: number, comment: string) => void;
  className?: string;
  isSubmitting?: boolean;
}

const ReviewForm = ({ onSubmit, className, isSubmitting = false }: ReviewFormProps) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0 && comment.trim() && !isSubmitting) {
      onSubmit?.(rating, comment.trim());
    }
  };

  const displayRating = hoveredRating || rating;

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-5", className)}>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-800">
          Votre note <span className="text-red-500">*</span>
        </label>

        <div className="flex flex-wrap items-center gap-2 rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => {
              const starValue = i + 1;
              return (
                <button
                  key={starValue}
                  type="button"
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHoveredRating(starValue)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="rounded-full p-1 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  <Star
                    className={cn(
                      "h-7 w-7 transition-colors",
                      starValue <= displayRating
                        ? "fill-[#f8c44f] text-[#f8c44f]"
                        : "text-slate-300",
                    )}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="review-comment" className="text-sm font-semibold text-slate-800">
          Votre avis <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="review-comment"
          placeholder="Partagez votre expérience avec ce véhicule..."
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, 500))}
          rows={4}
          className="min-h-[120px] resize-none rounded-[0.85rem] border-slate-200 bg-slate-50/80 text-slate-700 placeholder:text-slate-400 focus-visible:ring-cyan-200"
        />
        <p className="text-xs text-slate-400">{comment.length}/500 caractères</p>
      </div>

      <Button
        type="submit"
        disabled={rating === 0 || !comment.trim() || isSubmitting}
        className="h-10 rounded-full bg-cyan-300 px-5 text-sm font-semibold text-white shadow-none hover:bg-cyan-300/90 disabled:bg-slate-200 disabled:text-slate-500"
      >
        <Send className="mr-2 h-4 w-4" />
        {isSubmitting ? "Publication..." : "Publier mon avis"}
      </Button>
    </form>
  );
};

export default ReviewForm;
