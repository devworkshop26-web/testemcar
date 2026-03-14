import React, { useState, useMemo } from 'react';
import { cn } from "@/lib/utils";

interface Photo {
    id?: number | string;
    image: string;
    is_primary?: boolean;
    order?: number;
}

interface VehicleGalleryProps {
    photos: Photo[];
    className?: string;
}

const VehicleGallery: React.FC<VehicleGalleryProps> = ({ photos: rawPhotos, className }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const photos = useMemo(() => {
        if (!rawPhotos?.length) return [];
        return [...rawPhotos].sort((a, b) => {
            if (a.is_primary === b.is_primary) {
                return (a.order ?? 0) - (b.order ?? 0);
            }
            return a.is_primary ? -1 : 1;
        });
    }, [rawPhotos]);

    if (photos.length === 0) {
        return (
            <div className={cn("w-full h-[400px] bg-gray-100 rounded-2xl flex items-center justify-center", className)}>
                <p className="text-gray-400">Aucune image disponible</p>
            </div>
        );
    }

    const mainPhoto = photos[selectedImageIndex] || photos[0];

    return (
        <section className={cn("w-full mb-8", className)}>
            {/* MAIN IMAGE – HAUTEUR FIXE */}
            <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-3xl overflow-hidden bg-gray-100 mb-4 shadow-sm border border-gray-100 relative group">
                <img
                    src={mainPhoto.image}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    alt="Véhicule principal"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>

            {/* THUMBNAILS */}
            {photos.length > 1 && (
                <div className="grid grid-cols-5 gap-3">
                    {photos.slice(0, 10).map((photo, idx) => ( // Limit to 10 photos to avoid wrapping issues
                        <button
                            key={photo.id || idx}
                            onClick={() => setSelectedImageIndex(idx)}
                            className={cn(
                                "h-16 sm:h-24 w-full rounded-xl overflow-hidden cursor-pointer transition-all border-2",
                                selectedImageIndex === idx
                                    ? "border-primary ring-2 ring-primary ring-offset-2 opacity-100 scale-105"
                                    : "border-transparent opacity-70 hover:opacity-100 hover:border-gray-300"
                            )}
                        >
                            <img
                                src={photo.image}
                                className="w-full h-full object-cover"
                                alt={`Vue ${idx + 1}`}
                            />
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
};

export default VehicleGallery;
