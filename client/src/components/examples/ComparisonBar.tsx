import { useState } from "react";
import { ComparisonBar } from "../ComparisonBar";

export default function ComparisonBarExample() {
  const [count, setCount] = useState(2);

  return (
    <div className="h-screen relative">
      <ComparisonBar
        selectedCount={count}
        onCompare={() => console.log("Compare clicked")}
        onClear={() => {
          setCount(0);
          console.log("Clear clicked");
        }}
      />
    </div>
  );
}
