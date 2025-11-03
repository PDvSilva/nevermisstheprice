import { useState } from "react";
import { ComparisonPanel } from "../ComparisonPanel";
import { Button } from "@/components/ui/button";
import { type Product } from "../ProductCard";
import speakerImage from "@assets/generated_images/Bluetooth_speaker_product_b4c6d5ee.png";
import headphonesImage from "@assets/generated_images/Headphones_product_photo_8f8144f9.png";

export default function ComparisonPanelExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      title: "Caixa de Som Bluetooth Portátil",
      image: speakerImage,
      currentPrice: 149.90,
      originalPrice: 249.90,
      discount: 40,
      url: "https://amazon.com",
      rating: 4.5,
      reviewCount: 1234,
    },
    {
      id: "2",
      title: "Fone de Ouvido Noise Cancelling Premium",
      image: headphonesImage,
      currentPrice: 299.90,
      originalPrice: 399.90,
      discount: 25,
      url: "https://amazon.com",
      rating: 4.7,
      reviewCount: 856,
    },
  ]);

  const handleRemoveProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    console.log("Removed product:", id);
  };

  return (
    <div className="p-4">
      <Button onClick={() => setIsOpen(true)}>Abrir Comparação</Button>
      <ComparisonPanel
        products={products}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onRemoveProduct={handleRemoveProduct}
      />
    </div>
  );
}
