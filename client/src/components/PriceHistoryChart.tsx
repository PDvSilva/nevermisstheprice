import { TrendingDown, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface PricePoint {
  date: string;
  price: number;
}

interface PriceHistoryChartProps {
  data?: PricePoint[];
  currentPrice: number;
}

export function PriceHistoryChart({ currentPrice }: PriceHistoryChartProps) {
  // todo: remove mock functionality - use real price history data
  const mockData: PricePoint[] = [
    { date: "Jan", price: 599.90 },
    { date: "Fev", price: 579.90 },
    { date: "Mar", price: 549.90 },
    { date: "Abr", price: 529.90 },
    { date: "Mai", price: 499.90 },
    { date: "Jun", price: 449.90 },
    { date: "Hoje", price: currentPrice },
  ];

  const maxPrice = Math.max(...mockData.map(d => d.price));
  const minPrice = Math.min(...mockData.map(d => d.price));
  const priceRange = maxPrice - minPrice;
  const trend = mockData[mockData.length - 1].price < mockData[0].price ? "down" : "up";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Histórico de Preços (6 meses)</h3>
        <div className={`flex items-center gap-1 text-sm ${trend === "down" ? "text-green-600" : "text-red-600"}`}>
          {trend === "down" ? (
            <>
              <TrendingDown className="h-4 w-4" />
              <span className="font-medium">Em queda</span>
            </>
          ) : (
            <>
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">Em alta</span>
            </>
          )}
        </div>
      </div>

      <div className="relative h-40 bg-muted/30 rounded-lg p-4">
        <div className="absolute inset-4 flex items-end justify-between gap-2">
          {mockData.map((point, index) => {
            const heightPercent = ((point.price - minPrice) / priceRange) * 100;
            const isLowest = point.price === minPrice;
            
            return (
              <motion.div
                key={point.date}
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(heightPercent, 10)}%` }}
                transition={{ delay: index * 0.1, duration: 0.5, type: "spring" }}
                className="flex-1 relative group"
              >
                <div className={`w-full h-full rounded-t-md transition-all ${
                  isLowest 
                    ? "bg-gradient-to-t from-green-500 to-green-400" 
                    : "bg-gradient-to-t from-primary/60 to-primary/40"
                } group-hover:from-primary group-hover:to-primary/80`}>
                  <motion.div
                    className="absolute -top-8 left-1/2 -translate-x-1/2 bg-background border shadow-lg px-2 py-1 rounded text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={false}
                  >
                    R$ {point.price.toFixed(2)}
                  </motion.div>
                </div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">
                  {point.date}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4">
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="text-xs text-muted-foreground mb-1">Preço Atual</div>
          <div className="font-bold text-lg">R$ {currentPrice.toFixed(2)}</div>
        </div>
        <div className="text-center p-3 bg-green-500/10 rounded-lg">
          <div className="text-xs text-muted-foreground mb-1">Menor Preço</div>
          <div className="font-bold text-lg text-green-600">R$ {minPrice.toFixed(2)}</div>
        </div>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="text-xs text-muted-foreground mb-1">Economia</div>
          <div className="font-bold text-lg text-green-600">R$ {(maxPrice - currentPrice).toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
