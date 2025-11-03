import { ModernProductCard } from "../ModernProductCard";
import { type EnhancedProduct } from "../EnhancedProductCard";
import speakerImage from "@assets/generated_images/Bluetooth_speaker_product_b4c6d5ee.png";

export default function ModernProductCardExample() {
  const product: EnhancedProduct = {
    id: "1",
    title: "Caixa de Som Bluetooth Portátil JBL Flip 6",
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
  };

  return (
    <div className="max-w-xs p-4">
      <ModernProductCard
        product={product}
        onClick={() => console.log("Product clicked")}
      />
    </div>
  );
}
