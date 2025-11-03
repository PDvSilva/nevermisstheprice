import { ProductCard, type Product } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  selectedProducts: Set<string>;
  onToggleSelect: (id: string) => void;
  maxSelection?: number;
}

export function ProductGrid({
  products,
  selectedProducts,
  onToggleSelect,
  maxSelection = 4,
}: ProductGridProps) {
  const isSelectionDisabled = (productId: string) => {
    return selectedProducts.size >= maxSelection && !selectedProducts.has(productId);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isSelected={selectedProducts.has(product.id)}
          onToggleSelect={onToggleSelect}
          selectionDisabled={isSelectionDisabled(product.id)}
        />
      ))}
    </div>
  );
}
