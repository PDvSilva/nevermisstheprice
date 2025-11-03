import { Card } from "@/components/ui/card";
import {
  Smartphone,
  Laptop,
  Tv,
  Home,
  Dumbbell,
  Baby,
  Car,
  BookOpen,
  Gamepad2,
  Shirt,
  Utensils,
  Wrench,
} from "lucide-react";

export interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const CATEGORIES: Category[] = [
  { id: "informatica", name: "Informática", icon: <Laptop className="h-8 w-8" /> },
  { id: "smartphones", name: "Smartphones", icon: <Smartphone className="h-8 w-8" /> },
  { id: "imagem-som", name: "Imagem e Som", icon: <Tv className="h-8 w-8" /> },
  { id: "electrodomesticos", name: "Electrodomésticos", icon: <Home className="h-8 w-8" /> },
  { id: "gaming", name: "Gaming", icon: <Gamepad2 className="h-8 w-8" /> },
  { id: "desporto", name: "Desporto", icon: <Dumbbell className="h-8 w-8" /> },
  { id: "moda", name: "Moda", icon: <Shirt className="h-8 w-8" /> },
  { id: "casa", name: "Casa e Decoração", icon: <Home className="h-8 w-8" /> },
  { id: "puericultura", name: "Puericultura", icon: <Baby className="h-8 w-8" /> },
  { id: "auto", name: "Auto e Moto", icon: <Car className="h-8 w-8" /> },
  { id: "cultura", name: "Cultura", icon: <BookOpen className="h-8 w-8" /> },
  { id: "gastronomia", name: "Gastronomia", icon: <Utensils className="h-8 w-8" /> },
];

interface CategoryGridProps {
  onCategoryClick: (categoryId: string) => void;
}

export function CategoryGrid({ onCategoryClick }: CategoryGridProps) {
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6">Categorias</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {CATEGORIES.map((category) => (
          <Card
            key={category.id}
            className="p-4 cursor-pointer hover-elevate active-elevate-2 transition-all"
            onClick={() => onCategoryClick(category.id)}
            data-testid={`card-category-${category.id}`}
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="text-primary">{category.icon}</div>
              <span className="text-sm font-medium line-clamp-2">
                {category.name}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
