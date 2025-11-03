import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type Product } from "./ProductCard";

interface ComparisonPanelProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveProduct: (id: string) => void;
}

export function ComparisonPanel({
  products,
  isOpen,
  onClose,
  onRemoveProduct,
}: ComparisonPanelProps) {
  if (products.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Comparar Produtos</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {products.map((product) => (
            <Card key={product.id} className="relative" data-testid={`card-comparison-${product.id}`}>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10 h-6 w-6 rounded-full bg-background/80 backdrop-blur-sm"
                onClick={() => onRemoveProduct(product.id)}
                data-testid={`button-remove-${product.id}`}
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-base line-clamp-2">
                  {product.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Preço atual</div>
                  <div className="text-2xl font-bold text-foreground">
                    R$ {product.currentPrice.toFixed(2)}
                  </div>
                  {product.originalPrice && (
                    <div className="text-sm text-muted-foreground line-through">
                      R$ {product.originalPrice.toFixed(2)}
                    </div>
                  )}
                </div>

                {product.discount && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Desconto</div>
                    <Badge variant="destructive">-{product.discount}%</Badge>
                  </div>
                )}

                {product.rating && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Avaliação</div>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="font-medium">{product.rating.toFixed(1)}</span>
                      {product.reviewCount && (
                        <span className="text-sm text-muted-foreground">
                          ({product.reviewCount.toLocaleString()})
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <Button
                  className="w-full"
                  onClick={() => window.open(product.url, "_blank")}
                  data-testid={`button-view-comparison-${product.id}`}
                >
                  Ver na Amazon
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
