import { ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ComparisonBarProps {
  selectedCount: number;
  maxSelection?: number;
  onCompare: () => void;
  onClear: () => void;
}

export function ComparisonBar({
  selectedCount,
  maxSelection = 4,
  onCompare,
  onClear,
}: ComparisonBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t shadow-lg p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShoppingCart className="h-5 w-5 text-primary" />
          <div>
            <div className="font-semibold" data-testid="text-comparison-count">
              {selectedCount} {selectedCount === 1 ? "produto selecionado" : "produtos selecionados"}
            </div>
            <div className="text-xs text-muted-foreground">
              Máximo {maxSelection} produtos
            </div>
          </div>
          {selectedCount >= 2 && (
            <Badge variant="secondary">
              Pronto para comparar
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            data-testid="button-clear-selection"
          >
            <X className="h-4 w-4 mr-1" />
            Limpar
          </Button>
          <Button
            onClick={onCompare}
            disabled={selectedCount < 2}
            data-testid="button-compare"
          >
            Comparar Produtos
          </Button>
        </div>
      </div>
    </div>
  );
}
