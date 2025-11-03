import { LoadingSkeleton } from "../LoadingSkeleton";

export default function LoadingSkeletonExample() {
  return (
    <div className="p-4">
      <LoadingSkeleton count={4} />
    </div>
  );
}
