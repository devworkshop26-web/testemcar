import React, { useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

interface ImageCarouselProps {
  photos: Array<{ image: string }>;
  title: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ photos, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!photos || photos.length === 0) {
    return (
      <div className="relative w-full aspect-[16/10] bg-gradient-to-br from-muted to-muted/50 rounded-2xl border border-dashed border-border flex items-center justify-center">
        <div className="text-center space-y-3 p-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-muted-foreground/10 flex items-center justify-center">
            <ImageOff className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground">Aucune photo</p>
            <p className="text-sm text-muted-foreground mt-1">
              Ajoutez des photos pour améliorer la visibilité
            </p>
          </div>
        </div>
      </div>
    );
  }

  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % photos.length);
  const goToPrev = () => setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);

  return (
    <div className="relative group overflow-hidden rounded-2xl border border-border/60 shadow-lg bg-card">
      {/* Main Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={photos[currentIndex]?.image}
          alt={`${title} - Photo ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-500"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Navigation Arrows */}
      {photos.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            type="button"
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-background/90 backdrop-blur-sm text-foreground rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-background hover:scale-105"
            aria-label="Photo précédente"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-background/90 backdrop-blur-sm text-foreground rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-background hover:scale-105"
            aria-label="Photo suivante"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {photos.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {photos.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-200 ${
                idx === currentIndex 
                  ? "w-8 bg-background" 
                  : "w-2 bg-background/50 hover:bg-background/70"
              }`}
              aria-label={`Aller à la photo ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Photo Counter */}
      {photos.length > 1 && (
        <div className="absolute top-4 right-4 px-3 py-1.5 bg-background/90 backdrop-blur-sm rounded-lg text-xs font-medium shadow-lg">
          {currentIndex + 1} / {photos.length}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
