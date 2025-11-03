import { useState } from "react";
import { FilterBar, type SortOption, type PriceRange } from "../FilterBar";

export default function FilterBarExample() {
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [priceRange, setPriceRange] = useState<PriceRange>("all");

  const hasActiveFilters = sortBy !== "relevance" || priceRange !== "all";

  const handleClearFilters = () => {
    setSortBy("relevance");
    setPriceRange("all");
    console.log("Filters cleared");
  };

  return (
    <FilterBar
      sortBy={sortBy}
      priceRange={priceRange}
      onSortChange={setSortBy}
      onPriceRangeChange={setPriceRange}
      onClearFilters={handleClearFilters}
      hasActiveFilters={hasActiveFilters}
      resultCount={24}
    />
  );
}
