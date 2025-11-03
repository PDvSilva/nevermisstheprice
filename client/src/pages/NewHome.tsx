import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CategoryGrid } from "@/components/CategoryGrid";
import { FeaturedDeals } from "@/components/FeaturedDeals";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { type EnhancedProduct } from "@/components/EnhancedProductCard";
import speakerImage from "@assets/generated_images/Bluetooth_speaker_product_b4c6d5ee.png";
import headphonesImage from "@assets/generated_images/Headphones_product_photo_8f8144f9.png";
import smartwatchImage from "@assets/generated_images/Smartwatch_product_photo_2be62869.png";
import laptopImage from "@assets/generated_images/Laptop_product_photo_a5b96b89.png";
import mouseImage from "@assets/generated_images/Wireless_mouse_product_2d6109f8.png";
import keyboardImage from "@assets/generated_images/Mechanical_keyboard_product_0a96b8d5.png";

// todo: remove mock functionality
const FEATURED_PRODUCTS: EnhancedProduct[] = [
  {
    id: "1",
    title: "Caixa de Som Bluetooth Portátil JBL Flip 6 com Resistência à Água IPX7",
    image: speakerImage,
    lowestPrice: 399.90,
    originalPrice: 599.90,
    discountPercentage: 33,
    sellers: [
      { name: "Amazon BR", price: 399.90, url: "https://amazon.com.br" },
      { name: "Mercado Livre", price: 429.90, url: "https://mercadolivre.com.br" },
      { name: "Magazine Luiza", price: 449.90, url: "https://magazineluiza.com.br" },
    ],
    rating: 4.7,
    reviewCount: 2341,
    badges: ["best-price", "best-seller"],
  },
  {
    id: "2",
    title: "Fone de Ouvido Bluetooth Sony WH-1000XM5 com Cancelamento de Ruído",
    image: headphonesImage,
    lowestPrice: 1299.90,
    originalPrice: 1799.90,
    discountPercentage: 28,
    sellers: [
      { name: "Amazon BR", price: 1299.90, url: "https://amazon.com.br" },
      { name: "Fast Shop", price: 1349.90, url: "https://fastshop.com.br" },
      { name: "Americanas", price: 1399.90, url: "https://americanas.com.br" },
    ],
    rating: 4.9,
    reviewCount: 5432,
    badges: ["best-seller"],
  },
  {
    id: "3",
    title: "Smartwatch Xiaomi Mi Band 8 Pro com GPS e Monitor Cardíaco",
    image: smartwatchImage,
    lowestPrice: 249.90,
    originalPrice: 349.90,
    discountPercentage: 29,
    sellers: [
      { name: "Amazon BR", price: 249.90, url: "https://amazon.com.br" },
      { name: "Mercado Livre", price: 269.90, url: "https://mercadolivre.com.br" },
    ],
    rating: 4.5,
    reviewCount: 1876,
    badges: ["best-price"],
  },
  {
    id: "4",
    title: "Notebook Lenovo IdeaPad 3i Intel Core i5 8GB 256GB SSD 15.6\" Full HD",
    image: laptopImage,
    lowestPrice: 2499.90,
    originalPrice: 3299.90,
    discountPercentage: 24,
    sellers: [
      { name: "Amazon BR", price: 2499.90, url: "https://amazon.com.br" },
      { name: "Kabum", price: 2549.90, url: "https://kabum.com.br" },
      { name: "Magazine Luiza", price: 2599.90, url: "https://magazineluiza.com.br" },
      { name: "Casas Bahia", price: 2649.90, url: "https://casasbahia.com.br" },
    ],
    rating: 4.3,
    reviewCount: 987,
    badges: ["favorite"],
  },
  {
    id: "5",
    title: "Mouse Logitech MX Master 3S Sem Fio Ergonômico 8000 DPI",
    image: mouseImage,
    lowestPrice: 379.90,
    originalPrice: 549.90,
    discountPercentage: 31,
    sellers: [
      { name: "Amazon BR", price: 379.90, url: "https://amazon.com.br" },
      { name: "Kabum", price: 399.90, url: "https://kabum.com.br" },
      { name: "Pichau", price: 419.90, url: "https://pichau.com.br" },
    ],
    rating: 4.8,
    reviewCount: 3214,
    badges: ["best-price", "best-seller"],
  },
  {
    id: "6",
    title: "Teclado Mecânico Gamer Razer BlackWidow V3 Pro RGB Switch Green ABNT2",
    image: keyboardImage,
    lowestPrice: 699.90,
    originalPrice: 999.90,
    discountPercentage: 30,
    sellers: [
      { name: "Amazon BR", price: 699.90, url: "https://amazon.com.br" },
      { name: "Kabum", price: 749.90, url: "https://kabum.com.br" },
      { name: "Terabyte", price: 779.90, url: "https://terabyteshop.com.br" },
    ],
    rating: 4.6,
    reviewCount: 1654,
    badges: ["best-price"],
  },
  {
    id: "7",
    title: "Caixa de Som Portátil Bose SoundLink Flex Bluetooth com 12h de Bateria",
    image: speakerImage,
    lowestPrice: 649.90,
    originalPrice: 899.90,
    discountPercentage: 28,
    sellers: [
      { name: "Amazon BR", price: 649.90, url: "https://amazon.com.br" },
      { name: "Fast Shop", price: 699.90, url: "https://fastshop.com.br" },
    ],
    rating: 4.7,
    reviewCount: 876,
    badges: ["favorite"],
  },
  {
    id: "8",
    title: "Fone Bluetooth TWS Xiaomi Redmi Buds 4 Pro com ANC e Estojo de Recarga",
    image: headphonesImage,
    lowestPrice: 189.90,
    originalPrice: 299.90,
    discountPercentage: 37,
    sellers: [
      { name: "Amazon BR", price: 189.90, url: "https://amazon.com.br" },
      { name: "Mercado Livre", price: 199.90, url: "https://mercadolivre.com.br" },
      { name: "Americanas", price: 219.90, url: "https://americanas.com.br" },
    ],
    rating: 4.4,
    reviewCount: 2567,
    badges: ["best-price"],
  },
  {
    id: "9",
    title: "Smartwatch Apple Watch Series 9 GPS 45mm Meia-Noite com Pulseira Esportiva",
    image: smartwatchImage,
    lowestPrice: 3499.90,
    originalPrice: 4299.90,
    discountPercentage: 19,
    sellers: [
      { name: "Amazon BR", price: 3499.90, url: "https://amazon.com.br" },
      { name: "iPlace", price: 3599.90, url: "https://iplace.com.br" },
      { name: "Fast Shop", price: 3699.90, url: "https://fastshop.com.br" },
    ],
    rating: 4.9,
    reviewCount: 4321,
    badges: ["best-seller", "favorite"],
  },
  {
    id: "10",
    title: "Mouse Gamer Razer DeathAdder V3 Pro Sem Fio 30000 DPI com RGB Chroma",
    image: mouseImage,
    lowestPrice: 549.90,
    originalPrice: 799.90,
    discountPercentage: 31,
    sellers: [
      { name: "Amazon BR", price: 549.90, url: "https://amazon.com.br" },
      { name: "Kabum", price: 579.90, url: "https://kabum.com.br" },
    ],
    rating: 4.8,
    reviewCount: 1987,
    badges: ["best-price"],
  },
];

// todo: remove mock functionality
const SMARTPHONES_PRODUCTS: EnhancedProduct[] = [
  {
    id: "s1",
    title: "Samsung Galaxy A56 5G 6.7\" Dual SIM 8GB/256GB Graphite",
    image: smartwatchImage,
    lowestPrice: 1499.90,
    sellers: [
      { name: "Amazon BR", price: 1499.90, url: "https://amazon.com.br" },
      { name: "Magazine Luiza", price: 1549.90, url: "https://magazineluiza.com.br" },
    ],
    rating: 4.8,
    reviewCount: 543,
    badges: ["best-seller"],
  },
  {
    id: "s2",
    title: "Xiaomi Redmi Note 14 Pro 5G 6.67\" Dual SIM 8GB/256GB Black",
    image: smartwatchImage,
    lowestPrice: 1299.90,
    originalPrice: 1699.90,
    discountPercentage: 24,
    sellers: [
      { name: "Amazon BR", price: 1299.90, url: "https://amazon.com.br" },
    ],
    rating: 4.7,
    reviewCount: 876,
    badges: ["best-price"],
  },
];

export default function NewHome() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<EnhancedProduct | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // todo: remove mock functionality
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;
    console.log("Searching for:", query);
    setSearchQuery(query);
  };

  const handleCategoryClick = (categoryId: string) => {
    console.log("Category clicked:", categoryId);
  };

  const handleProductClick = (product: EnhancedProduct) => {
    console.log("Product clicked:", product.id);
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="px-4 md:px-6 lg:px-8 py-3 max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-3">
            <h1 className="text-xl md:text-2xl font-bold text-primary">
              KuantoKusta PT
            </h1>
            <ThemeToggle />
          </div>

          <form onSubmit={handleSearch}>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  name="search"
                  placeholder="O que procura?"
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
              <Button type="submit" data-testid="button-search">
                Pesquisar
              </Button>
            </div>
          </form>
        </div>
      </header>

      <main className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <CategoryGrid onCategoryClick={handleCategoryClick} />

        <FeaturedDeals
          products={FEATURED_PRODUCTS}
          onProductClick={handleProductClick}
        />

        <div className="py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Smartphones e Acessórios</h2>
            <Button variant="ghost" className="text-primary">
              ver mais &gt;
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {SMARTPHONES_PRODUCTS.map((product) => (
              <div key={product.id} onClick={() => handleProductClick(product)}>
                <div className="cursor-pointer hover-elevate rounded-lg overflow-hidden bg-card border transition-all">
                  <div className="aspect-square bg-muted relative">
                    {product.badges && product.badges.length > 0 && (
                      <div className="absolute top-2 left-2 z-10">
                        {product.badges.map((badge) => (
                          <div
                            key={badge}
                            className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded mb-1"
                          >
                            {badge === "best-seller" && "Mais vendido"}
                            {badge === "best-price" && "Boa compra"}
                            {badge === "favorite" && "Favorito"}
                          </div>
                        ))}
                      </div>
                    )}
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium line-clamp-2 mb-2 min-h-[2.5rem]">
                      {product.title}
                    </h3>
                    <div className="text-xs text-muted-foreground mb-1">desde</div>
                    <div className="text-lg font-bold">
                      R$ {product.lowestPrice.toFixed(2)}
                    </div>
                    {product.rating && (
                      <div className="flex items-center gap-1 text-xs mt-1">
                        <span className="text-yellow-500">★</span>
                        <span>{product.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer className="py-8 border-t mt-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 Comparador de Preços - Encontre as melhores ofertas online</p>
          </div>
        </footer>
      </main>

      <ProductDetailModal
        product={selectedProduct}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
}
