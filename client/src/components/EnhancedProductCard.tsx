import { ExternalLink, Store } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface Seller {
  name: string;
  price: number;
  url: string;
  logo?: string;
}

export interface EnhancedProduct {
  id: string;
  title: string;
  image: string;
  lowestPrice: number;
  originalPrice?: number;
  sellers: Seller[];
  rating?: number;
  reviewCount?: number;
  badges?: ("best-seller" | "best-price" | "favorite")[];
  discountPercentage?: number;
}

interface EnhancedProductCardProps {
  product: EnhancedProduct;
  onClick?: () => void;
}

export function EnhancedProductCard({ product, onClick }: EnhancedProductCardProps) {
  const mainSeller = product.sellers[0];
  
  const getBadgeContent = (badge: string) => {
    switch (badge) {
      case "best-seller":
        return { text: "Mais vendido", variant: "default" as const };
      case "best-price":
        return { text: "Boa compra", variant: "destructive" as const };
      case "favorite":
        return { text: "Favorito", variant: "secondary" as const };
      default:
        return null;
    }
  };

  return (
    <Card
      className="group cursor-pointer hover-elevate overflow-hidden transition-all"
      onClick={onClick}
      data-testid={`card-enhanced-${product.id}`}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.discountPercentage && product.discountPercentage > 0 && (
          <div className="absolute top-2 left-2 z-10 bg-destructive text-destructive-foreground text-sm font-bold px-2 py-1 rounded">
            -{product.discountPercentage}%
          </div>
        )}
        
        {product.badges && product.badges.length > 0 && (
          <div className="absolute top-2 right-2 z-10">
            {product.badges.map((badge) => {
              const badgeContent = getBadgeContent(badge);
              if (!badgeContent) return null;
              return (
                <Badge
                  key={badge}
                  variant={badgeContent.variant}
                  className="mb-1 text-xs"
                  data-testid={`badge-${badge}-${product.id}`}
                >
                  {badgeContent.text}
                </Badge>
              );
            })}
          </div>
        )}

        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
      </div>

      <CardContent className="p-4">
        <h3 className="font-medium text-base line-clamp-2 mb-3 min-h-[3rem]" data-testid={`text-title-${product.id}`}>
          {product.title}
        </h3>

        <div className="space-y-2">
          <div>
            <div className="text-xs text-muted-foreground mb-1">desde</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground" data-testid={`text-price-${product.id}`}>
                R$ {product.lowestPrice.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  R$ {product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {product.rating && (
            <div className="flex items-center gap-1 text-sm">
              <span className="text-yellow-500">★</span>
              <span className="font-medium">{product.rating.toFixed(1)}</span>
              {product.reviewCount && (
                <span className="text-muted-foreground text-xs">
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
      </CardContent>
    </Card>
  );
}
