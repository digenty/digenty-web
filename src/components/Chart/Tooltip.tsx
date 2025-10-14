// CustomTooltip.tsx
import { TooltipProps } from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    // The data for the current bar is in payload[0].payload
    const dataPoint = payload[0].payload;
    const paidValue = dataPoint.Paid;
    const unpaidValue = dataPoint.Unpaid;
    const totalValue = dataPoint.Total;

    // Calculate percentages (as done in the design, 50% for JSS 1)
    const paidPercent = ((paidValue / totalValue) * 100).toFixed(0);
    const unpaidPercent = ((unpaidValue / totalValue) * 100).toFixed(0);

    // Format currency
    const formatCurrency = (value: number) => `₦${value.toLocaleString()}`;

    return (
      <div className="rounded-lg border bg-white p-3 text-sm shadow-lg transition-all duration-300 ease-in-out">
        <p className="mb-1 font-bold">{label}</p>
        <hr className="mb-2" />
        {/* Paid Row */}
        <div className="flex items-center justify-between space-x-4">
          <span className="flex items-center">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-blue-600"></span>
            Paid
          </span>
          <span className="text-right font-semibold">
            {paidPercent}% · {formatCurrency(paidValue)}
          </span>
        </div>
        {/* Unpaid Row */}
        <div className="flex items-center justify-between space-x-4">
          <span className="flex items-center">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-gray-300"></span>
            Unpaid
          </span>
          <span className="text-right font-semibold">
            {unpaidPercent}% · {formatCurrency(unpaidValue)}
          </span>
        </div>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
