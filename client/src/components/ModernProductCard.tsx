import { ExternalLink, Store, TrendingDown, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { type EnhancedProduct } from "./EnhancedProductCard";

interface ModernProductCardProps {
  product: EnhancedProduct;
  onClick?: () => void;
  index?: number;
}

export function ModernProductCard({ product, onClick, index = 0 }: ModernProductCardProps) {
  const savings = product.originalPrice
    ? product.originalPrice - product.lowestPrice
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      <Card
        className="group cursor-pointer overflow-hidden border-2 hover:border-primary/50 hover:shadow-xl transition-all duration-300"
        onClick={onClick}
        data-testid={`card-modern-${product.id}`}
      >
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted to-muted/50">
          {product.discountPercentage && product.discountPercentage > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="absolute top-3 left-3 z-10"
            >
              <div className="bg-destructive text-destructive-foreground text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
                -{product.discountPercentage}%
              </div>
            </motion.div>
          )}

          {product.badges && product.badges.length > 0 && (
            <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
              {product.badges.map((badge) => (
                <Badge
                  key={badge}
                  variant={badge === "best-price" ? "destructive" : badge === "best-seller" ? "default" : "secondary"}
                  className="text-xs shadow-md backdrop-blur-sm"
                >
                  {badge === "best-seller" && "🔥 Top"}
                  {badge === "best-price" && "💰 Oferta"}
                  {badge === "favorite" && "⭐ Favorito"}
                </Badge>
              ))}
            </div>
          )}

          <motion.img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <Button
              size="sm"
              className="w-full bg-white/90 text-foreground hover:bg-white backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
            >
              Ver detalhes
              <ExternalLink className="ml-2 h-3 w-3" />
            </Button>
          </motion.div>
        </div>

        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
            {product.title}
          </h3>

          {savings > 0 && (
            <div className="flex items-center gap-2 text-xs text-green-600">
              <TrendingDown className="h-3 w-3" />
              <span className="font-medium">Economize R$ {savings.toFixed(2)}</span>
            </div>
          )}

          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">a partir de</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">
                R$ {product.lowestPrice.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  R$ {product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            {product.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-sm">{product.rating.toFixed(1)}</span>
                {product.reviewCount && (
                  <span className="text-xs text-muted-foreground">
                    ({product.reviewCount})
                  </span>
                )}
              </div>
            )}

            {product.sellers.length > 1 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Store className="h-3 w-3" />
                <span>{product.sellers.length} lojas</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
