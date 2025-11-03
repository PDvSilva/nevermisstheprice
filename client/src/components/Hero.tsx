import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import heroImage from "@assets/generated_images/Hero_banner_shopping_image_bd02190a.png";

interface HeroProps {
  onSearch: (query: string) => void;
}

export function Hero({ onSearch }: HeroProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className="relative h-64 md:h-80 lg:h-96 w-full overflow-hidden">
      <img
        src={heroImage}
        alt="Shopping"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      
      <div className="relative h-full flex flex-col items-center justify-center px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-2">
          Comparador de Preços Amazon
        </h1>
        <p className="text-lg md:text-xl text-white/90 text-center mb-8">
          Encontre as melhores ofertas e economize
        </p>
        
        <form onSubmit={handleSubmit} className="w-full max-w-2xl">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                name="search"
                placeholder="Buscar produtos..."
                className="pl-10 bg-white/95 backdrop-blur-sm border-white/20"
                data-testid="input-search"
              />
            </div>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90"
              data-testid="button-search"
            >
              Buscar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
