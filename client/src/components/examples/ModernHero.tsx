import { ModernHero } from "../ModernHero";

export default function ModernHeroExample() {
  return (
    <ModernHero onSearch={(query) => console.log("Search:", query)} />
  );
}
