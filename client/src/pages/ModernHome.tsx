import { useState } from "react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ModernHero } from "@/components/ModernHero";
import { ModernCategoryGrid } from "@/components/ModernCategoryGrid";
import { ModernProductCard } from "@/components/ModernProductCard";
import { ModernProductModal } from "@/components/ModernProductModal";
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
    ],
    rating: 4.8,
    reviewCount: 3214,
    badges: ["best-price", "best-seller"],
  },
  {
    id: "6",
    title: "Teclado Mecânico Gamer Razer BlackWidow V3 Pro RGB ABNT2",
    image: keyboardImage,
    lowestPrice: 699.90,
    originalPrice: 999.90,
    discountPercentage: 30,
    sellers: [
      { name: "Amazon BR", price: 699.90, url: "https://amazon.com.br" },
      { name: "Kabum", price: 749.90, url: "https://kabum.com.br" },
    ],
    rating: 4.6,
    reviewCount: 1654,
    badges: ["best-price"],
  },
  {
    id: "7",
    title: "Caixa de Som Bose SoundLink Flex Bluetooth com 12h de Bateria",
    image: speakerImage,
    lowestPrice: 649.90,
    originalPrice: 899.90,
    discountPercentage: 28,
    sellers: [
      { name: "Amazon BR", price: 649.90, url: "https://amazon.com.br" },
    ],
    rating: 4.7,
    reviewCount: 876,
    badges: ["favorite"],
  },
  {
    id: "8",
    title: "Fone TWS Xiaomi Redmi Buds 4 Pro com ANC",
    image: headphonesImage,
    lowestPrice: 189.90,
    originalPrice: 299.90,
    discountPercentage: 37,
    sellers: [
      { name: "Amazon BR", price: 189.90, url: "https://amazon.com.br" },
      { name: "Mercado Livre", price: 199.90, url: "https://mercadolivre.com.br" },
    ],
    rating: 4.4,
    reviewCount: 2567,
    badges: ["best-price"],
  },
];

export default function ModernHome() {
  const [selectedProduct, setSelectedProduct] = useState<EnhancedProduct | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
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
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
            >
              PriceCompare
            </motion.h1>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <ModernHero onSearch={handleSearch} />

      <main className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <ModernCategoryGrid onCategoryClick={handleCategoryClick} />

        <div className="py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-end justify-between mb-2">
              <div>
                <h2 className="text-3xl font-bold">Ofertas Imperdíveis</h2>
                <p className="text-muted-foreground mt-1">
                  💰 Economize até 70% comparando preços
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {FEATURED_PRODUCTS.map((product, index) => (
              <ModernProductCard
                key={product.id}
                product={product}
                onClick={() => handleProductClick(product)}
                index={index}
              />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="py-12"
        >
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-2 border-blue-500/20">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-xl font-bold mb-2">Compare em tempo real</h3>
              <p className="text-muted-foreground">
                Preços atualizados de milhares de lojas online
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-600/10 border-2 border-green-500/20">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="text-xl font-bold mb-2">Economize mais</h3>
              <p className="text-muted-foreground">
                Encontre descontos de até 70% nos seus produtos favoritos
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-2 border-purple-500/20">
              <div className="text-4xl mb-3">🛡️</div>
              <h3 className="text-xl font-bold mb-2">100% confiável</h3>
              <p className="text-muted-foreground">
                Redirecionamos para lojas verificadas e seguras
              </p>
            </div>
          </div>
        </motion.div>

        <footer className="py-12 border-t mt-12">
          <div className="text-center space-y-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              PriceCompare
            </div>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              O melhor comparador de preços online. Encontre ofertas incríveis e economize nas suas compras.
            </p>
            <div className="text-xs text-muted-foreground">
              © 2025 PriceCompare. Todos os direitos reservados.
            </div>
          </div>
        </footer>
      </main>

      <ModernProductModal
        product={selectedProduct}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
}
