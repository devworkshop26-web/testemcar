import { Plane, Calendar, Truck, MapPin } from "lucide-react";
import { useState } from "react";

const categories = [
  { id: "popular", label: "Populaires", icon: MapPin },
  { id: "airport", label: "Aéroports", icon: Plane },
  { id: "monthly", label: "Location mensuelle", icon: Calendar },
  { id: "delivery", label: "Livraison possible", icon: Truck },
];

const CategoryTabs = () => {
  const [activeTab, setActiveTab] = useState("popular");

  return (
    <div className="border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                  activeTab === category.id
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                {category.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryTabs;
