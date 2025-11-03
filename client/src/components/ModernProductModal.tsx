import { X, ExternalLink, Store, Shield, TrendingDown, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { type EnhancedProduct } from "./EnhancedProductCard";
import { PriceHistoryChart } from "./PriceHistoryChart";

interface ModernProductModalProps {
  product: EnhancedProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ModernProductModal({
  product,
  isOpen,
  onClose,
}: ModernProductModalProps) {
  if (!product) return null;

  const sortedSellers = [...product.sellers].sort((a, b) => a.price - b.price);
  const savings = product.originalPrice ? product.originalPrice - product.lowestPrice : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold pr-8 line-clamp-1">{product.title}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="shrink-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 p-6">
            <div className="space-y-6">
              <div className="relative aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-2xl overflow-hidden group">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {product.discountPercentage && product.discountPercentage > 0 && (
                  <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground text-lg font-bold px-4 py-2 rounded-full shadow-xl">
                    -{product.discountPercentage}%
                  </div>
                )}

                {savings > 0 && (
                  <div className="absolute bottom-4 left-4 right-4 bg-green-600 text-white p-4 rounded-xl shadow-xl backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-5 w-5" />
                      <div>
                        <div className="text-sm opacity-90">Você economiza</div>
                        <div className="text-xl font-bold">R$ {savings.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {product.rating && (
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                    <div>
                      <div className="text-2xl font-bold">{product.rating.toFixed(1)}</div>
                      <div className="text-xs text-muted-foreground">de 5.0</div>
                    </div>
                  </div>
                  {product.reviewCount && (
                    <div className="border-l pl-4">
                      <div className="text-lg font-semibold">{product.reviewCount.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">avaliações</div>
                    </div>
                  )}
                </div>
              )}

              {product.badges && product.badges.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.badges.includes("best-seller") && (
                    <Badge variant="default" className="text-sm py-1.5 px-3">
                      🔥 Mais vendido
                    </Badge>
                  )}
                  {product.badges.includes("best-price") && (
                    <Badge variant="destructive" className="text-sm py-1.5 px-3">
                      💰 Melhor preço
                    </Badge>
                  )}
                  {product.badges.includes("favorite") && (
                    <Badge variant="secondary" className="text-sm py-1.5 px-3">
                      ⭐ Favorito dos clientes
                    </Badge>
                  )}
                </div>
              )}

              <div className="p-4 bg-primary/5 rounded-xl border-2 border-primary/20">
                <PriceHistoryChart currentPrice={product.lowestPrice} />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Store className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold">
                    Comparar em {sortedSellers.length} {sortedSellers.length === 1 ? "loja" : "lojas"}
                  </h3>
                </div>

                <div className="space-y-3">
                  <AnimatePresence>
                    {sortedSellers.map((seller, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                          index === 0
                            ? "border-primary bg-primary/5 shadow-lg"
                            : "border-border hover:border-primary/50 hover:shadow-md"
                        }`}
                      >
                        {index === 0 && (
                          <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                            Melhor Oferta
                          </div>
                        )}

                        <div className="p-4">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1">
                              <div className="font-semibold text-lg mb-1">{seller.name}</div>
                              <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold">
                                  R$ {seller.price.toFixed(2)}
                                </span>
                                {index > 0 && (
                                  <span className="text-sm text-muted-foreground">
                                    +R$ {(seller.price - sortedSellers[0].price).toFixed(2)}
                                  </span>
                                )}
                              </div>
                              {product.originalPrice && index === 0 && (
                                <div className="text-sm text-muted-foreground mt-1">
                                  De{" "}
                                  <span className="line-through">
                                    R$ {product.originalPrice.toFixed(2)}
                                  </span>
                                  {" "}por{" "}
                                  <span className="text-green-600 font-semibold">
                                    R$ {seller.price.toFixed(2)}
                                  </span>
                                </div>
                              )}
                            </div>

                            <Button
                              onClick={() => window.open(seller.url, "_blank")}
                              variant={index === 0 ? "default" : "outline"}
                              size={index === 0 ? "default" : "sm"}
                              className="shrink-0"
                            >
                              {index === 0 ? "Ir para loja" : "Ver oferta"}
                              <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                          </div>

                          {index === 0 && (
                            <div className="flex items-center gap-4 pt-3 border-t text-xs">
                              <div className="flex items-center gap-1 text-green-600">
                                <Shield className="h-3 w-3" />
                                <span>Compra segura</span>
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <TrendingDown className="h-3 w-3" />
                                <span>Melhor preço dos últimos 30 dias</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <div className="p-4 bg-muted/30 rounded-xl border-2 border-dashed">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    💡
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold mb-1">Dica de economia</div>
                    <p className="text-muted-foreground">
                      Comparamos preços de múltiplas lojas para você encontrar a melhor oferta.
                      Os preços podem variar conforme disponibilidade.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
