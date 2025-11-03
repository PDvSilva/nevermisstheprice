import { EnhancedProductCard, type EnhancedProduct } from "./EnhancedProductCard";

interface FeaturedDealsProps {
  products: EnhancedProduct[];
  onProductClick: (product: EnhancedProduct) => void;
}

export function FeaturedDeals({ products, onProductClick }: FeaturedDealsProps) {
  if (products.length === 0) return null;

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Boa Compra</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Percentagem calculada comparando com o preço mais baixo dos últimos 30 dias
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <EnhancedProductCard
            key={product.id}
            product={product}
            onClick={() => onProductClick(product)}
          />
        ))}
      </div>
    </div>
  );
}
