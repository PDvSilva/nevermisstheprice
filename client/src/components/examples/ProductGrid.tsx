import { useState } from "react";
import { ProductGrid } from "../ProductGrid";
import { type Product } from "../ProductCard";
import speakerImage from "@assets/generated_images/Bluetooth_speaker_product_b4c6d5ee.png";
import headphonesImage from "@assets/generated_images/Headphones_product_photo_8f8144f9.png";
import smartwatchImage from "@assets/generated_images/Smartwatch_product_photo_2be62869.png";

export default function ProductGridExample() {
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  const products: Product[] = [
    {
      id: "1",
      title: "Caixa de Som Bluetooth Portátil",
      image: speakerImage,
      currentPrice: 149.90,
      originalPrice: 249.90,
      url: "https://amazon.com",
      rating: 4.5,
      reviewCount: 1234,
      priceHistory: "down",
    },
    {
      id: "2",
      title: "Fone de Ouvido Noise Cancelling",
      image: headphonesImage,
      currentPrice: 299.90,
      originalPrice: 399.90,
      url: "https://amazon.com",
      rating: 4.7,
      reviewCount: 856,
      priceHistory: "stable",
    },
    {
      id: "3",
      title: "Smartwatch Fitness Tracker",
      image: smartwatchImage,
      currentPrice: 199.90,
      url: "https://amazon.com",
      rating: 4.3,
      reviewCount: 542,
      priceHistory: "up",
    },
  ];

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

  return (
    <div className="p-4">
      <ProductGrid
        products={products}
        selectedProducts={selectedProducts}
        onToggleSelect={handleToggleSelect}
      />
    </div>
  );
}
