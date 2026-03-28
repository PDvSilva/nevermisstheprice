import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { type EnhancedProduct } from "./EnhancedProductCard";

interface ModernProductCardProps {
  product: EnhancedProduct;
  onClick?: () => void;
  index?: number;
}

export function ModernProductCard({ product, onClick, index = 0 }: ModernProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      {/* Card container */}
      <div className="relative rounded-3xl bg-[#fff3e0] dark:bg-[#1a1208] overflow-hidden aspect-square flex items-center justify-center">
        {/* Product image */}
        <img
          src={product.image}
          alt={product.title}
          className="w-3/4 h-3/4 object-contain group-hover:scale-105 transition-transform duration-500"
        />

        {/* Arrow button — bottom right */}
        <div className="absolute bottom-4 right-4 h-12 w-12 rounded-full bg-[#ffe0b2]/80 dark:bg-amazon-900/60 flex items-center justify-center group-hover:bg-amazon-500 transition-colors duration-200">
          <ArrowUpRight className="h-5 w-5 text-zinc-700 group-hover:text-white transition-colors" />
        </div>

        {/* Discount badge */}
        {product.discountPercentage && product.discountPercentage > 0 && (
          <div className="absolute top-4 left-4 bg-amazon-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {product.discountPercentage}%
          </div>
        )}
      </div>

      {/* Text — outside the card */}
      <div className="mt-4 px-1 space-y-0.5">
        <div className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white line-clamp-1">
          {product.title}
        </div>
        <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          {product.sellers.length > 1 ? `${product.sellers.length} countries` : product.sellers[0]?.name}
        </div>
        <div className="text-sm text-zinc-400 font-medium">
          from €{product.lowestPrice.toFixed(2)}
        </div>
      </div>
    </motion.div>
  );
}
