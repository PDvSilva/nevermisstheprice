import { PriceHistoryChart } from "../PriceHistoryChart";

export default function PriceHistoryChartExample() {
  return (
    <div className="p-4 max-w-2xl">
      <PriceHistoryChart currentPrice={399.90} />
    </div>
  );
}
