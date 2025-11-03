import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export type SortOption = "relevance" | "price-asc" | "price-desc";
export type PriceRange = "all" | "0-50" | "50-100" | "100-200" | "200+";

interface FilterBarProps {
  sortBy: SortOption;
  priceRange: PriceRange;
  onSortChange: (sort: SortOption) => void;
  onPriceRangeChange: (range: PriceRange) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  resultCount?: number;
}

export function FilterBar({
  sortBy,
  priceRange,
  onSortChange,
  onPriceRangeChange,
  onClearFilters,
  hasActiveFilters,
  resultCount,
}: FilterBarProps) {
  return (
    <div className="sticky top-0 z-10 bg-background border-b px-4 md:px-6 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">
              {resultCount !== undefined && `${resultCount} produtos encontrados`}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
            <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
              <SelectTrigger className="w-[180px]" data-testid="select-sort">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevância</SelectItem>
                <SelectItem value="price-asc">Menor preço</SelectItem>
                <SelectItem value="price-desc">Maior preço</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={(value) => onPriceRangeChange(value as PriceRange)}>
              <SelectTrigger className="w-[180px]" data-testid="select-price-range">
                <SelectValue placeholder="Faixa de preço" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os preços</SelectItem>
                <SelectItem value="0-50">Até R$ 50</SelectItem>
                <SelectItem value="50-100">R$ 50 - R$ 100</SelectItem>
                <SelectItem value="100-200">R$ 100 - R$ 200</SelectItem>
                <SelectItem value="200+">Acima de R$ 200</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                data-testid="button-clear-filters"
              >
                <X className="h-4 w-4 mr-1" />
                Limpar filtros
              </Button>
            )}
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {priceRange !== "all" && (
              <Badge variant="secondary" data-testid="badge-price-filter">
                Preço: {priceRange === "0-50" ? "Até R$ 50" : priceRange === "50-100" ? "R$ 50-100" : priceRange === "100-200" ? "R$ 100-200" : "R$ 200+"}
              </Badge>
            )}
            {sortBy !== "relevance" && (
              <Badge variant="secondary" data-testid="badge-sort-filter">
                {sortBy === "price-asc" ? "Menor preço" : "Maior preço"}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
