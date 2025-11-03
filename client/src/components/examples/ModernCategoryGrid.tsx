import { ModernCategoryGrid } from "../ModernCategoryGrid";

export default function ModernCategoryGridExample() {
  return (
    <div className="p-4">
      <ModernCategoryGrid
        onCategoryClick={(id) => console.log("Category clicked:", id)}
      />
    </div>
  );
}
