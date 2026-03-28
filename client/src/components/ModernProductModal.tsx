import { X, ExternalLink, Store, Shield, TrendingDown } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { type EnhancedProduct } from "./EnhancedProductCard";
import { PriceHistoryChart } from "./PriceHistoryChart";

interface ModernProductModalProps {
  product: EnhancedProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ModernProductModal({ product, isOpen, onClose }: ModernProductModalProps) {
  if (!product) return null;

  const sortedSellers = [...product.sellers].sort((a, b) => a.price - b.price);
  const savings =
    sortedSellers.length > 1
      ? sortedSellers[sortedSellers.length - 1].price - sortedSellers[0].price
      : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0 rounded-3xl border-zinc-100 dark:border-zinc-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-100 dark:border-zinc-800 px-8 py-5 flex items-center justify-between">
            <h2 className="text-base font-semibold tracking-tight pr-8 line-clamp-1 text-zinc-900 dark:text-white">
              {product.title}
            </h2>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center transition-colors"
            >
              <X className="h-4 w-4 text-zinc-500" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Left column */}
            <div className="space-y-5">
              {/* Product image */}
              <div className="relative aspect-square bg-zinc-50 dark:bg-zinc-800 rounded-2xl overflow-hidden group">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.discountPercentage && product.discountPercentage > 0 && (
                  <div className="absolute top-4 left-4 bg-amazon-600 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
                    -{product.discountPercentage}%
                  </div>
                )}
                {savings > 0 && (
                  <div className="absolute bottom-4 left-4 right-4 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3">
                    <TrendingDown className="h-4 w-4 shrink-0" />
                    <div>
                      <div className="text-xs opacity-80">You save vs. most expensive</div>
                      <div className="text-lg font-bold">€{savings.toFixed(2)}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Price chart */}
              <div className="p-5 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                <PriceHistoryChart currentPrice={product.lowestPrice} />
              </div>

              {/* Badges */}
              {product.badges && product.badges.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.badges.includes("best-seller") && (
                    <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400">
                      🔥 Popular product
                    </span>
                  )}
                  {product.badges.includes("best-price") && (
                    <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                      💰 Best price found
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Right column */}
            <div className="space-y-5">
              {/* Country comparison */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Store className="h-4 w-4 text-amazon-500" />
                  <h3 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-white">
                    Compare across {sortedSellers.length} {sortedSellers.length === 1 ? "country" : "countries"}
                  </h3>
                </div>

                <div className="space-y-2.5">
                  <AnimatePresence>
                    {sortedSellers.map((seller, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                        className={`relative rounded-2xl border-2 transition-all duration-200 ${
                          index === 0
                            ? "border-amazon-200 dark:border-amazon-800 bg-amazon-50/50 dark:bg-amazon-950/30"
                            : "border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700"
                        }`}
                      >
                        {index === 0 && (
                          <div className="absolute -top-px right-4 bg-amazon-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-b-lg">
                            Best deal
                          </div>
                        )}

                        <div className="p-4 flex items-center justify-between gap-4">
                          <div>
                            <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-0.5">
                              {seller.name}
                            </div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                                €{seller.price.toFixed(2)}
                              </span>
                              {index > 0 && (
                                <span className="text-xs text-red-500">
                                  +€{(seller.price - sortedSellers[0].price).toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => window.open(seller.url, "_blank")}
                            className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                              index === 0
                                ? "bg-amazon-600 text-white hover:bg-amazon-700 shadow-sm shadow-amazon-500/30"
                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                            }`}
                          >
                            {index === 0 ? "Buy now" : "View"}
                            <ExternalLink className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {index === 0 && (
                          <div className="px-4 pb-4 flex items-center gap-4 text-xs text-zinc-500">
                            <div className="flex items-center gap-1 text-emerald-600">
                              <Shield className="h-3 w-3" />
                              Secure purchase
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingDown className="h-3 w-3" />
                              Cheapest across EU
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Tip */}
              <div className="p-5 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-700">
                <div className="flex gap-3">
                  <span className="text-xl shrink-0">💡</span>
                  <div className="text-sm">
                    <div className="font-medium text-zinc-800 dark:text-zinc-200 mb-1">Saving tip</div>
                    <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      Prices are live from Amazon. Non-EUR currencies are converted automatically.
                      Shipping and import duties may apply when buying across borders.
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
