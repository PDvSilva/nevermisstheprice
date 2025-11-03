import { useState } from "react";
import { ModernProductModal } from "../ModernProductModal";
import { Button } from "@/components/ui/button";
import { type EnhancedProduct } from "../EnhancedProductCard";
import speakerImage from "@assets/generated_images/Bluetooth_speaker_product_b4c6d5ee.png";

export default function ModernProductModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  const product: EnhancedProduct = {
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
      { name: "Americanas", price: 459.90, url: "https://americanas.com.br" },
    ],
    rating: 4.7,
    reviewCount: 2341,
    badges: ["best-price", "best-seller"],
  };

  return (
    <div className="p-4">
      <Button onClick={() => setIsOpen(true)}>Abrir Modal Moderno</Button>
      <ModernProductModal
        product={product}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}
