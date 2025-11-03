import { EmptyState } from "../EmptyState";

export default function EmptyStateExample() {
  return (
    <div className="space-y-8">
      <EmptyState type="no-search" />
      <hr />
      <EmptyState
        type="no-results"
        onAction={() => console.log("Adjust search clicked")}
      />
    </div>
  );
}
