import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { marquesVehiculeUseQuery } from "@/useQuery/marquesUseQuery";
import { useModelesVehiculeQuery } from "@/useQuery/ModeleVehiculeUseQuery";
import { categoryVehiculeUseQuery } from "@/useQuery/categoryUseQuery";

export default function SearchVehiclesPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    marque: "",
    modele: "",
    categorie: "",
    ville: "",
    min_price: "",
    max_price: "",
    start_date: "",
    end_date: "",
  });

  const { data: marques = [] } = marquesVehiculeUseQuery();
  const { data: modeles = [] } = useModelesVehiculeQuery();
  const { CategoryData: categories = [] } = categoryVehiculeUseQuery();
  

  const handleSearch = () => {
    // Sauvegarder les filtres dans localStorage et naviguer vers la page de résultats
    const searchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        searchParams.append(key, value);
      }
    });
    
    // Sauvegarder aussi dans localStorage pour faciliter l'accès
    localStorage.setItem('searchFilters', JSON.stringify(filters));
    
    navigate(`/search-results?${searchParams.toString()}`);
  };

  return (
    <Card className="w-full shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
      <CardContent className="p-4 sm:p-5 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Marque */}
          <div>
            <Select 
              value={filters.marque || "all"} 
              onValueChange={(v) => setFilters({ ...filters, marque: v === "all" ? "" : v })}
            >
              <SelectTrigger className="h-11 sm:h-12 text-sm">
                <SelectValue placeholder="Marque" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-sm">
                <SelectItem value="all">Toutes les marques</SelectItem>
                {marques.map((m: any) => (
                  <SelectItem key={m.id} value={m.id}>{m.nom}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Modèle */}
          <div>
            <Select 
              value={filters.modele || "all"} 
              onValueChange={(v) => setFilters({ ...filters, modele: v === "all" ? "" : v })}
            >
              <SelectTrigger className="h-11 sm:h-12 text-sm">
                <SelectValue placeholder="Modèle" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-sm">
                <SelectItem value="all">Tous les modèles</SelectItem>
                {modeles.map((m: any) => (
                  <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Catégorie */}
          <div>
            <Select 
              value={filters.categorie || "all"} 
              onValueChange={(v) => setFilters({ ...filters, categorie: v === "all" ? "" : v })}
            >
              <SelectTrigger className="h-11 sm:h-12 text-sm">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-sm">
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map((c: any) => (
                  <SelectItem key={c.id} value={c.id}>{c.nom}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ville */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Ville"
              value={filters.ville}
              onChange={(e) => setFilters({ ...filters, ville: e.target.value })}
              className="pl-9 h-11 sm:h-12 text-sm"
            />
          </div>

          {/* Prix min */}
          <div>
            <Input
              type="number"
              placeholder="Prix min (Ar)"
              value={filters.min_price}
              onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
              className="h-11 sm:h-12 text-sm"
            />
          </div>

          {/* Prix max */}
          <div>
            <Input
              type="number"
              placeholder="Prix max (Ar)"
              value={filters.max_price}
              onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
              className="h-11 sm:h-12 text-sm"
            />
          </div>

          {/* Date début */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              type="date"
              value={filters.start_date}
              onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
              className="pl-9 h-11 sm:h-12 text-sm"
            />
          </div>

          {/* Date fin */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              type="date"
              value={filters.end_date}
              onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
              className="pl-9 h-11 sm:h-12 text-sm"
            />
          </div>

          {/* Bouton Rechercher */}
          <Button 
            className="col-span-full sm:col-span-2 lg:col-span-4 h-11 sm:h-12 bg-primary hover:bg-primary/90 text-white font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={handleSearch}
          >
            <Search className="w-4 h-4 mr-2" />
            Rechercher des véhicules
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
