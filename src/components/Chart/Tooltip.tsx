import { TooltipProps } from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

export const Tooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;

    const paidValue = dataPoint.paid_abs;
    const unpaidValue = dataPoint.unpaid_abs;

    const paidPercent = dataPoint.paid.toFixed(0);
    const unpaidPercent = dataPoint.unpaid.toFixed(0);

    // Format currency
    const formatCurrency = (value: number) => `₦${value.toLocaleString()}`;

    return (
      <div className="border-default-transparent/10 bg-card-bg rounded-lg border p-3 text-xs shadow-lg transition-all duration-300 ease-in-out">
        <p className="mb-1 font-bold text-zinc-950">{label}</p>
        <hr className="border-default-transparent/10 mb-2" />
        {/* Paid Row */}
        <div className="flex items-center justify-between space-x-4">
          <span className="flex items-center text-zinc-600">
            <span className="rounded-2xs mr-2 inline-block size-3 bg-blue-500"></span>
            Paid
          </span>
          <span className="text-right font-normal text-zinc-500">
            {paidPercent}% · {formatCurrency(paidValue)}
          </span>
        </div>
        {/* Unpaid Row */}
        <div className="flex items-center justify-between space-x-4">
          <span className="flex items-center text-zinc-600">
            <span className="rounded-2xs mr-2 inline-block size-3 bg-gray-300"></span>
            Unpaid
          </span>
          <span className="text-right font-normal text-zinc-500">
            {unpaidPercent}% · {formatCurrency(unpaidValue)}
          </span>
        </div>
      </div>
    );
  }

  return null;
};
