import { ExternalLink, Store } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { type EnhancedProduct } from "./EnhancedProductCard";

interface ProductDetailModalProps {
  product: EnhancedProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailModal({
  product,
  isOpen,
  onClose,
}: ProductDetailModalProps) {
  if (!product) return null;

  const sortedSellers = [...product.sellers].sort((a, b) => a.price - b.price);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{product.title}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div>
            <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-4">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            {product.rating && (
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 text-xl">★</span>
                  <span className="text-lg font-semibold">{product.rating.toFixed(1)}</span>
                </div>
                {product.reviewCount && (
                  <span className="text-sm text-muted-foreground">
                    ({product.reviewCount.toLocaleString()} avaliações)
                  </span>
                )}
              </div>
            )}

            {product.badges && product.badges.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {product.badges.includes("best-seller") && (
                  <Badge variant="default">Mais vendido</Badge>
                )}
                {product.badges.includes("best-price") && (
                  <Badge variant="destructive">Boa compra</Badge>
                )}
                {product.badges.includes("favorite") && (
                  <Badge variant="secondary">Favorito clientes</Badge>
                )}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Store className="h-5 w-5" />
              Comparar Preços ({sortedSellers.length} lojas)
            </h3>

            <div className="space-y-3">
              {sortedSellers.map((seller, index) => (
                <Card
                  key={index}
                  className={`p-4 ${index === 0 ? "border-primary border-2" : ""}`}
                  data-testid={`card-seller-${index}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="font-medium mb-1">{seller.name}</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">
                          R$ {seller.price.toFixed(2)}
                        </span>
                        {index === 0 && (
                          <Badge variant="destructive" className="text-xs">
                            Menor preço
                          </Badge>
                        )}
                      </div>
                      {product.originalPrice && index === 0 && (
                        <div className="text-sm text-muted-foreground mt-1">
                          <span className="line-through">
                            R$ {product.originalPrice.toFixed(2)}
                          </span>
                          {product.discountPercentage && (
                            <span className="ml-2 text-green-600 font-medium">
                              Poupa {product.discountPercentage}%
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={() => window.open(seller.url, "_blank")}
                      variant={index === 0 ? "default" : "outline"}
                      data-testid={`button-buy-${index}`}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ir para loja
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Dica:</strong> Compare os preços acima e escolha a melhor
                oferta. Os preços podem variar conforme disponibilidade e condições
                de cada loja.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
