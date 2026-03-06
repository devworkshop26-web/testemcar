import { BadgeCheck, Star, Briefcase, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChauffeurCardProps {
    firstName: string;
    lastName: string;
    photoUrl?: string;
    experience?: number;
    rating?: number;
    phone?: string;
    className?: string;
}

const ChauffeurCard = ({
    firstName,
    lastName,
    photoUrl,
    experience,
    rating,
    phone,
    className,
}: ChauffeurCardProps) => {
    const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();

    return (
        <div className={cn("flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border border-border/40", className)}>
            {/* Avatar */}
            <div className="relative shrink-0">
                {photoUrl ? (
                    <img
                        src={photoUrl}
                        alt={`${firstName} ${lastName}`}
                        className="w-16 h-16 rounded-full object-cover ring-4 ring-background shadow-sm"
                    />
                ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-xl ring-4 ring-background shadow-sm">
                        {initials}
                    </div>
                )}
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border-2 border-background shadow-sm">
                    <BadgeCheck className="w-3 h-3 text-white" />
                </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-1">
                <h4 className="font-bold text-foreground text-lg leading-tight truncate">
                    {firstName} {lastName}
                </h4>

                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                    {experience !== undefined && (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-poppins">
                            <Briefcase className="w-3.5 h-3.5" />
                            <span>{experience} ans d'exp.</span>
                        </div>
                    )}

                    {rating !== undefined && (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-poppins font-semibold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{rating.toFixed(1)}</span>
                        </div>
                    )}
                </div>

                {phone && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-2 font-poppins font-medium">
                        <Phone className="w-3.5 h-3.5 text-primary" />
                        <span>{phone}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChauffeurCard;
