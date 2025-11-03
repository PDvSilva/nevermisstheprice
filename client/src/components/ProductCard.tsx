import { ExternalLink, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

export interface Product {
  id: string;
  title: string;
  image: string;
  currentPrice: number;
  originalPrice?: number;
  discount?: number;
  url: string;
  rating?: number;
  reviewCount?: number;
  priceHistory?: "up" | "down" | "stable";
}

interface ProductCardProps {
  product: Product;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  selectionDisabled?: boolean;
}

export function ProductCard({
  product,
  isSelected = false,
  onToggleSelect,
  selectionDisabled = false,
}: ProductCardProps) {
  const discountPercentage = product.discount || 
    (product.originalPrice 
      ? Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100)
      : 0);

  return (
    <Card 
      className={`group relative hover-elevate overflow-hidden transition-all ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      data-testid={`card-product-${product.id}`}
    >
      {onToggleSelect && (
        <div className="absolute top-2 left-2 z-10">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(product.id)}
            disabled={selectionDisabled && !isSelected}
            className="bg-white border-2 shadow-sm"
            data-testid={`checkbox-select-${product.id}`}
          />
        </div>
      )}

      {discountPercentage > 0 && (
        <Badge
          className="absolute top-2 right-2 bg-destructive text-destructive-foreground"
          data-testid={`badge-discount-${product.id}`}
        >
          -{discountPercentage}%
        </Badge>
      )}

      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
      </div>

      <CardContent className="p-4">
        <h3 className="font-medium text-lg line-clamp-2 mb-2" data-testid={`text-title-${product.id}`}>
          {product.title}
        </h3>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl md:text-3xl font-bold text-foreground" data-testid={`text-price-${product.id}`}>
            R$ {product.currentPrice.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              R$ {product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {product.priceHistory && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {product.priceHistory === "down" && (
              <>
                <TrendingDown className="h-3 w-3 text-green-600" />
                <span className="text-green-600">Preço em queda</span>
              </>
            )}
            {product.priceHistory === "up" && (
              <>
                <TrendingUp className="h-3 w-3 text-destructive" />
                <span className="text-destructive">Preço em alta</span>
              </>
            )}
          </div>
        )}

        {product.rating && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
            <span className="text-yellow-500">★</span>
            <span>{product.rating.toFixed(1)}</span>
            {product.reviewCount && (
              <span>({product.reviewCount.toLocaleString()})</span>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          variant="default"
          onClick={() => window.open(product.url, "_blank")}
          data-testid={`button-view-${product.id}`}
        >
          Ver na Amazon
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
