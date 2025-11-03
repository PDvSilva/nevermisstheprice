import { useState } from "react";
import { ProductCard, type Product } from "../ProductCard";
import speakerImage from "@assets/generated_images/Bluetooth_speaker_product_b4c6d5ee.png";

export default function ProductCardExample() {
  const [selected, setSelected] = useState(false);

  const product: Product = {
    id: "1",
    title: "Caixa de Som Bluetooth Portátil com Graves Potentes",
    image: speakerImage,
    currentPrice: 149.90,
    originalPrice: 249.90,
    discount: 40,
    url: "https://amazon.com",
    rating: 4.5,
    reviewCount: 1234,
    priceHistory: "down",
  };

  return (
    <div className="max-w-xs">
      <ProductCard
        product={product}
        isSelected={selected}
        onToggleSelect={() => setSelected(!selected)}
      />
    </div>
  );
}
