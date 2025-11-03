import { CategoryGrid } from "../CategoryGrid";

export default function CategoryGridExample() {
  return (
    <div className="p-4">
      <CategoryGrid
        onCategoryClick={(id) => console.log("Category clicked:", id)}
      />
    </div>
  );
}
