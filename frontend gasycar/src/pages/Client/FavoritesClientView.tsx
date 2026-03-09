import { Heart } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

// --- VUE 4 : FAVORIS (FAVORITES) ---
const FavoritesClientView = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold font-poppins">Mes Favoris</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2].map((i) => (
                    <Card key={i} className="border-none shadow-md rounded-2xl overflow-hidden">
                        <div className="relative h-48 bg-gray-200">
                            <img src={`/src/assets/car-${i}.jpg`} className="w-full h-full object-cover" />
                            <button className="absolute top-3 right-3 p-2 bg-white rounded-full text-red-500 shadow-sm">
                                <Heart className="w-5 h-5 fill-current" />
                            </button>
                        </div>
                        <CardContent className="p-5">
                            <h3 className="font-bold text-lg">Mitsubishi L200</h3>
                            <p className="text-blue-600 font-bold mt-2">200,000 Ar <span className="text-gray-400 text-xs font-normal">/ jour</span></p>
                            <Button className="w-full mt-4 rounded-xl bg-gray-900">Réserver maintenant</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default FavoritesClientView