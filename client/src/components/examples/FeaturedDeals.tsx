import { FeaturedDeals } from "../FeaturedDeals";
import { type EnhancedProduct } from "../EnhancedProductCard";
import speakerImage from "@assets/generated_images/Bluetooth_speaker_product_b4c6d5ee.png";
import headphonesImage from "@assets/generated_images/Headphones_product_photo_8f8144f9.png";
import smartwatchImage from "@assets/generated_images/Smartwatch_product_photo_2be62869.png";
import mouseImage from "@assets/generated_images/Wireless_mouse_product_2d6109f8.png";

export default function FeaturedDealsExample() {
  const products: EnhancedProduct[] = [
    {
      id: "1",
      title: "Caixa de Som Bluetooth JBL",
      image: speakerImage,
      lowestPrice: 149.90,
      originalPrice: 249.90,
      discountPercentage: 40,
      sellers: [
        { name: "Amazon BR", price: 149.90, url: "https://amazon.com.br" },
        { name: "Magazine Luiza", price: 169.90, url: "https://magazineluiza.com.br" },
      ],
      rating: 4.5,
      reviewCount: 1234,
      badges: ["best-price"],
    },
    {
      id: "2",
      title: "Fone de Ouvido Bluetooth Sony",
      image: headphonesImage,
      lowestPrice: 299.90,
      originalPrice: 399.90,
      discountPercentage: 25,
      sellers: [
        { name: "Amazon BR", price: 299.90, url: "https://amazon.com.br" },
      ],
      rating: 4.7,
      reviewCount: 856,
      badges: ["best-seller"],
    },
    {
      id: "3",
      title: "Smartwatch Xiaomi Band 8",
      image: smartwatchImage,
      lowestPrice: 199.90,
      sellers: [
        { name: "Amazon BR", price: 199.90, url: "https://amazon.com.br" },
      ],
      rating: 4.3,
      reviewCount: 542,
      badges: ["favorite"],
    },
    {
      id: "4",
      title: "Mouse Logitech MX Master 3S",
      image: mouseImage,
      lowestPrice: 379.90,
      originalPrice: 499.90,
      discountPercentage: 24,
      sellers: [
        { name: "Amazon BR", price: 379.90, url: "https://amazon.com.br" },
      ],
      rating: 4.8,
      reviewCount: 2145,
      badges: ["best-price", "best-seller"],
    },
  ];

  return (
    <div className="p-4">
      <FeaturedDeals
        products={products}
        onProductClick={(product) => console.log("Product clicked:", product.id)}
      />
    </div>
  );
}
