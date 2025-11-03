import { Search, TrendingDown, Zap, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import heroImage from "@assets/generated_images/Hero_banner_shopping_image_bd02190a.png";

interface ModernHeroProps {
  onSearch: (query: string) => void;
}

export function ModernHero({ onSearch }: ModernHeroProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="absolute inset-0 bg-grid-white/5 bg-[size:20px_20px]" />
      
      <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge variant="secondary" className="mb-4">
                <Zap className="h-3 w-3 mr-1" />
                Economize até 70% comparando preços
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            >
              Compare preços e{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                economize
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground max-w-md"
            >
              Encontre os melhores preços em milhares de lojas. Simples, rápido e confiável.
            </motion.p>

            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onSubmit={handleSubmit}
              className="space-y-3"
            >
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  type="search"
                  name="search"
                  placeholder="Ex: iPhone 15, notebook gamer, fone bluetooth..."
                  className="pl-12 h-14 text-base shadow-lg border-2 focus:border-primary transition-all"
                  data-testid="input-hero-search"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Popular:</span>
                {["iPhone 15", "AirPods", "PS5", "MacBook"].map((term) => (
                  <Button
                    key={term}
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => onSearch(term)}
                    className="h-7 text-xs hover-elevate"
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </motion.form>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-6 pt-4"
            >
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">+10K</div>
                  <div className="text-xs text-muted-foreground">Produtos</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">100%</div>
                  <div className="text-xs text-muted-foreground">Confiável</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative hidden md:block"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl blur-3xl" />
            <img
              src={heroImage}
              alt="Shopping"
              className="relative rounded-3xl shadow-2xl w-full h-auto"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
