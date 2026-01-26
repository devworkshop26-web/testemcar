import { Star, Users, Fuel, Settings, MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, memo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface VehicleCardProps {
  image: string;
  year: number;
  brand: string;
  model: string;
  rating: number;
  trips: number;
  price: number;
  oldPrice?: number;
  seats?: number;
  transmission?: string;
  fuel?: string;
  distance?: number;
  certified?: boolean;
  superHost?: boolean;
  newListing?: boolean;
  deliveryAvailable?: boolean;
  onReserve?: () => void;
  reserveButtonClassName?: string;
  reserveLabel?: string;
}

const VehicleCard = ({
  image,
  year,
  brand,
  model,
  rating,
  trips,
  price,
  oldPrice,
  seats = 5,
  transmission = "Auto",
  fuel = "Essence",
  distance,
  certified = false,
  superHost = false,
  newListing = false,
  deliveryAvailable = false,
  onReserve,
  reserveButtonClassName,
  reserveLabel = "Réserver",
}: VehicleCardProps) => {
  const hasDiscount = oldPrice && oldPrice > price;
  const discountPercentage = hasDiscount
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;

  const [isImageLoading, setIsImageLoading] = useState(true);

  return (
    <div className="w-full max-w-sm bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl border border-gray-200 hover:border-primary/40 cursor-pointer transition-all duration-300 group flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden flex-shrink-0">
        {isImageLoading && (
          <Skeleton className="absolute inset-0 w-full h-full bg-gray-200" />
        )}
        {image ? (
          <img
            src={image}
            alt={`${year} ${brand} ${model}`}
            onLoad={() => setIsImageLoading(false)}
            onError={(e) => {
              setIsImageLoading(false);
              e.currentTarget.src = "/placeholder-car.jpg";
            }}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isImageLoading ? "opacity-0" : "opacity-100"
              }`}
          />
        ) : (
          <Skeleton className="absolute inset-0 w-full h-full bg-gray-200" />
        )}

        {/* Overlay et Badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
        <div className="absolute top-2 left-2 flex flex-wrap gap-1.5 max-w-[80%]">
          {certified && (
            <Badge className="bg-white/90 backdrop-blur-sm text-blue-700 hover:bg-white text-[10px] font-medium px-2 py-0.5 rounded-md shadow-sm border-0">
              Certifié
            </Badge>
          )}
          {newListing && (
            <Badge className="bg-green-500 text-white hover:bg-green-600 text-[10px] font-medium px-2 py-0.5 rounded-md shadow-sm border-0">
              Nouveau
            </Badge>
          )}
          {superHost && (
            <Badge className="bg-orange-500 text-white hover:bg-orange-600 text-[10px] font-medium px-2 py-0.5 rounded-md shadow-sm border-0">
              Superhôte
            </Badge>
          )}
        </div>
        {deliveryAvailable && (
          <div className="absolute bottom-2 right-2">
            <Badge className="bg-black/60 backdrop-blur-md text-white hover:bg-black/70 text-[10px] font-medium px-2 py-0.5 rounded-full border-0">
              Livraison dispo
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col gap-3">
        {/* Header: Titre + Note + Distance */}
        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-poppins font-bold text-gray-900 text-lg leading-tight truncate pr-2">
              {brand} <span className="font-medium text-gray-700">{model}</span>
            </h3>
            <div className="flex items-center gap-1 flex-shrink-0 bg-gray-50 px-1.5 py-0.5 rounded-md border border-gray-100">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-gray-800 text-xs">{rating}</span>
              <span className="text-gray-400 text-[10px]">({trips})</span>
            </div>
          </div>

          <div className="h-4 flex items-center gap-1 mt-1 text-gray-500">
            {distance !== undefined ? (
              <>
                <MapPin className="w-3 h-3" />
                <span className="text-xs font-medium">
                  À {distance} km de vous
                </span>
              </>
            ) : (
              <span className="invisible text-xs">Placeholder</span>
            )}
          </div>
        </div>

        {/* Tech Specs Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 rounded-lg p-2 flex items-center gap-2 border border-gray-100">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs font-medium text-gray-700">{year}</span>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 flex items-center gap-2 border border-gray-100">
            <Settings className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs font-medium text-gray-700 truncate">
              {transmission}
            </span>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 flex items-center gap-2 border border-gray-100">
            <Fuel className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs font-medium text-gray-700 truncate">
              {fuel}
            </span>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 flex items-center gap-2 border border-gray-100">
            <Users className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs font-medium text-gray-700">
              {seats} places
            </span>
          </div>
        </div>

        {/* Footer: Prix & Action */}
        <div className="pt-3 mt-auto border-t border-gray-100 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="h-5 flex items-center gap-1.5 leading-none mb-0.5">
              {hasDiscount && (
                <>
                  <span className="text-xs text-gray-400 line-through decorations-red-400 decoration-1">
                    {oldPrice?.toLocaleString()} Ar
                  </span>
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1 rounded">
                    -{discountPercentage}%
                  </span>
                </>
              )}
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-primary font-poppins">
                {price.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500 font-medium">Ar/jour</span>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onReserve?.();
            }}
            className={cn(
              "bg-gray-900 hover:bg-primary text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors duration-200 shadow-sm",
              reserveButtonClassName
            )}
          >
            {reserveLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(VehicleCard);
