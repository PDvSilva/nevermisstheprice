import { Search, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  type: "no-results" | "no-search";
  onAction?: () => void;
}

export function EmptyState({ type, onAction }: EmptyStateProps) {
  if (type === "no-results") {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Nenhum produto encontrado</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Não encontramos produtos com os filtros selecionados. Tente ajustar sua busca ou limpar os filtros.
        </p>
        {onAction && (
          <Button onClick={onAction} data-testid="button-adjust-search">
            Ajustar Busca
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <ShoppingCart className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Comece sua busca</h3>
      <p className="text-muted-foreground max-w-md">
        Use a barra de pesquisa acima para encontrar produtos e comparar preços na Amazon.
      </p>
    </div>
  );
}
