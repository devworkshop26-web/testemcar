import { BadgeCheck, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface OwnerCardProps {
    firstName: string;
    lastName: string;
    photoUrl?: string;
    rating?: number;
    totalRentals?: number;
    isVerified?: boolean;
    className?: string;
}

const OwnerCard = ({
    firstName,
    lastName,
    photoUrl,
    rating,
    totalRentals,
    isVerified = true,
    className,
}: OwnerCardProps) => {
    const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();

    return (
        <div className={cn("flex items-center gap-4", className)}>
            {/* Avatar */}
            <div className="relative">
                {photoUrl ? (
                    <img
                        src={photoUrl}
                        alt={`${firstName} ${lastName}`}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/10"
                    />
                ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-semibold text-lg ring-2 ring-primary/10">
                        {initials}
                    </div>
                )}
                {isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
                        <BadgeCheck className="w-5 h-5 text-primary fill-primary/20" />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground truncate">
                        {firstName} {lastName}
                    </h4>
                </div>

                {isVerified && (
                    <span className="inline-flex items-center gap-1 text-xs text-primary font-medium mt-0.5">
                        <BadgeCheck className="w-3 h-3" />
                        Propriétaire vérifié
                    </span>
                )}

                {/* {(rating !== undefined || totalRentals !== undefined) && (
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        {rating !== undefined && (
                            <span className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                {rating.toFixed(1)}
                            </span>
                        )}
                        {totalRentals !== undefined && (
                            <span>• {totalRentals} locations</span>
                        )}
                    </div>
                )} */}
                {(rating != null && !isNaN(Number(rating))) && (
                    <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {Number(rating).toFixed(1)}
                    </span>
                )}

            </div>
        </div>
    );
};

export default OwnerCard;
