import { useState } from "react";
import { Hero } from "@/components/Hero";
import { FilterBar, type SortOption, type PriceRange } from "@/components/FilterBar";
import { ProductGrid } from "@/components/ProductGrid";
import { ComparisonPanel } from "@/components/ComparisonPanel";
import { ComparisonBar } from "@/components/ComparisonBar";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { type Product } from "@/components/ProductCard";
import speakerImage from "@assets/generated_images/Bluetooth_speaker_product_b4c6d5ee.png";
import headphonesImage from "@assets/generated_images/Headphones_product_photo_8f8144f9.png";
import smartwatchImage from "@assets/generated_images/Smartwatch_product_photo_2be62869.png";
import laptopImage from "@assets/generated_images/Laptop_product_photo_a5b96b89.png";
import mouseImage from "@assets/generated_images/Wireless_mouse_product_2d6109f8.png";
import keyboardImage from "@assets/generated_images/Mechanical_keyboard_product_0a96b8d5.png";

// todo: remove mock functionality
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Caixa de Som Bluetooth Portátil com Graves Potentes e Resistência à Água",
    image: speakerImage,
    currentPrice: 149.90,
    originalPrice: 249.90,
    discount: 40,
    url: "https://amazon.com.br",
    rating: 4.5,
    reviewCount: 1234,
    priceHistory: "down",
  },
  {
    id: "2",
    title: "Fone de Ouvido Bluetooth com Cancelamento de Ruído Ativo Premium",
    image: headphonesImage,
    currentPrice: 299.90,
    originalPrice: 399.90,
    discount: 25,
    url: "https://amazon.com.br",
    rating: 4.7,
    reviewCount: 856,
    priceHistory: "stable",
  },
  {
    id: "3",
    title: "Smartwatch Fitness Tracker com Monitor Cardíaco e GPS",
    image: smartwatchImage,
    currentPrice: 199.90,
    url: "https://amazon.com.br",
    rating: 4.3,
    reviewCount: 542,
    priceHistory: "up",
  },
  {
    id: "4",
    title: "Notebook Ultra Fino 15.6\" Intel Core i5 8GB RAM 256GB SSD",
    image: laptopImage,
    currentPrice: 2499.90,
    originalPrice: 2999.90,
    discount: 17,
    url: "https://amazon.com.br",
    rating: 4.6,
    reviewCount: 2341,
    priceHistory: "down",
  },
  {
    id: "5",
    title: "Mouse Sem Fio Ergonômico 2400 DPI Recarregável USB-C",
    image: mouseImage,
    currentPrice: 79.90,
    originalPrice: 119.90,
    discount: 33,
    url: "https://amazon.com.br",
    rating: 4.4,
    reviewCount: 678,
    priceHistory: "down",
  },
  {
    id: "6",
    title: "Teclado Mecânico Gamer RGB Switch Blue ABNT2 Anti-Ghosting",
    image: keyboardImage,
    currentPrice: 189.90,
    originalPrice: 259.90,
    discount: 27,
    url: "https://amazon.com.br",
    rating: 4.8,
    reviewCount: 1456,
    priceHistory: "stable",
  },
  {
    id: "7",
    title: "Caixa de Som Bluetooth Premium com Iluminação LED e 20h de Bateria",
    image: speakerImage,
    currentPrice: 199.90,
    url: "https://amazon.com.br",
    rating: 4.2,
    reviewCount: 324,
    priceHistory: "up",
  },
  {
    id: "8",
    title: "Fone de Ouvido In-Ear Bluetooth 5.0 com Estojo de Recarga",
    image: headphonesImage,
    currentPrice: 129.90,
    originalPrice: 199.90,
    discount: 35,
    url: "https://amazon.com.br",
    rating: 4.1,
    reviewCount: 891,
    priceHistory: "down",
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [priceRange, setPriceRange] = useState<PriceRange>("all");
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  // todo: remove mock functionality
  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    setSearchQuery(query);
    setHasSearched(true);
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  const handleClearFilters = () => {
    console.log("Clearing filters");
    setSortBy("relevance");
    setPriceRange("all");
  };

  const handleToggleSelect = (id: string) => {
    setSelectedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      console.log("Selected products:", Array.from(newSet));
      return newSet;
    });
  };

  const handleOpenComparison = () => {
    console.log("Opening comparison panel");
    setIsComparisonOpen(true);
  };

  const handleRemoveFromComparison = (id: string) => {
    setSelectedProducts((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      console.log("Removed from comparison:", id);
      return newSet;
    });
  };

  const handleClearSelection = () => {
    console.log("Clearing selection");
    setSelectedProducts(new Set());
  };

  // todo: remove mock functionality - implement real filtering
  const filterProducts = (products: Product[]): Product[] => {
    let filtered = products;

    if (priceRange !== "all") {
      filtered = filtered.filter((product) => {
        const price = product.currentPrice;
        switch (priceRange) {
          case "0-50":
            return price <= 50;
          case "50-100":
            return price > 50 && price <= 100;
          case "100-200":
            return price > 100 && price <= 200;
          case "200+":
            return price > 200;
          default:
            return true;
        }
      });
    }

    if (sortBy === "price-asc") {
      filtered = [...filtered].sort((a, b) => a.currentPrice - b.currentPrice);
    } else if (sortBy === "price-desc") {
      filtered = [...filtered].sort((a, b) => b.currentPrice - a.currentPrice);
    }

    return filtered;
  };

  const filteredProducts = hasSearched ? filterProducts(MOCK_PRODUCTS) : [];
  const selectedProductsList = MOCK_PRODUCTS.filter((p) =>
    selectedProducts.has(p.id)
  );
  const hasActiveFilters = sortBy !== "relevance" || priceRange !== "all";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-3 max-w-7xl mx-auto">
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            Amazon Price Tracker
          </h1>
          <ThemeToggle />
        </div>
      </header>

      <Hero onSearch={handleSearch} />

      {hasSearched && !isLoading && (
        <FilterBar
          sortBy={sortBy}
          priceRange={priceRange}
          onSortChange={setSortBy}
          onPriceRangeChange={setPriceRange}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
          resultCount={filteredProducts.length}
        />
      )}

      <main className="px-4 md:px-6 lg:px-8 py-8 max-w-7xl mx-auto pb-32">
        {isLoading && <LoadingSkeleton />}

        {!hasSearched && !isLoading && <EmptyState type="no-search" />}

        {hasSearched && !isLoading && filteredProducts.length === 0 && (
          <EmptyState type="no-results" onAction={handleClearFilters} />
        )}

        {hasSearched && !isLoading && filteredProducts.length > 0 && (
          <ProductGrid
            products={filteredProducts}
            selectedProducts={selectedProducts}
            onToggleSelect={handleToggleSelect}
          />
        )}
      </main>

      <ComparisonBar
        selectedCount={selectedProducts.size}
        onCompare={handleOpenComparison}
        onClear={handleClearSelection}
      />

      <ComparisonPanel
        products={selectedProductsList}
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        onRemoveProduct={handleRemoveFromComparison}
      />
    </div>
  );
}
