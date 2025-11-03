import { motion } from "framer-motion";
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

const CATEGORIES = [
  { id: "informatica", name: "Informática", icon: Laptop, color: "from-blue-500 to-blue-600" },
  { id: "smartphones", name: "Smartphones", icon: Smartphone, color: "from-purple-500 to-purple-600" },
  { id: "imagem-som", name: "Imagem e Som", icon: Tv, color: "from-pink-500 to-pink-600" },
  { id: "electrodomesticos", name: "Casa", icon: Home, color: "from-green-500 to-green-600" },
  { id: "gaming", name: "Gaming", icon: Gamepad2, color: "from-red-500 to-red-600" },
  { id: "desporto", name: "Desporto", icon: Dumbbell, color: "from-orange-500 to-orange-600" },
  { id: "moda", name: "Moda", icon: Shirt, color: "from-indigo-500 to-indigo-600" },
  { id: "puericultura", name: "Bebês", icon: Baby, color: "from-yellow-500 to-yellow-600" },
  { id: "auto", name: "Auto", icon: Car, color: "from-gray-500 to-gray-600" },
  { id: "cultura", name: "Cultura", icon: BookOpen, color: "from-teal-500 to-teal-600" },
  { id: "gastronomia", name: "Gastronomia", icon: Utensils, color: "from-rose-500 to-rose-600" },
  { id: "bricolagem", name: "Bricolagem", icon: Wrench, color: "from-cyan-500 to-cyan-600" },
];

interface ModernCategoryGridProps {
  onCategoryClick: (categoryId: string) => void;
}

export function ModernCategoryGrid({ onCategoryClick }: ModernCategoryGridProps) {
  return (
    <div className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold mb-2">Explorar Categorias</h2>
        <p className="text-muted-foreground">Encontre exatamente o que procura</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {CATEGORIES.map((category, index) => {
          const Icon = category.icon;
          return (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03, duration: 0.3 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCategoryClick(category.id)}
              className="group relative overflow-hidden rounded-2xl bg-card border-2 border-transparent hover:border-primary/50 p-6 transition-all duration-300 hover:shadow-lg"
              data-testid={`button-category-${category.id}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="relative flex flex-col items-center gap-3 text-center">
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-semibold group-hover:text-primary transition-colors">
                  {category.name}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
