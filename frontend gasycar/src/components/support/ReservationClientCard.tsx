import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User as UserIcon } from "lucide-react";
import { User } from "@/types/userType";

interface ReservationClientCardProps {
    user: User;
    title?: string;
}

export const ReservationClientCard = ({ user, title = "Client" }: ReservationClientCardProps) => {
    return (
        <Card className="border-none shadow-lg rounded-2xl overflow-hidden h-full">
            <CardHeader className="border-b border-gray-100 p-6">
                <div className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">{title}</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gray-100 p-1 border-2 border-white shadow-sm overflow-hidden">
                        {user?.image ? (
                            <img src={user.image} alt={title} className="w-full h-full object-cover rounded-full" />
                        ) : (
                            <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl rounded-full">
                                {user?.first_name?.[0]}{user?.last_name?.[0]}
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 text-lg">
                            {user?.first_name} {user?.last_name}
                        </p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                        <p className="text-sm text-gray-500">{user?.phone}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
