export const Legend = () => {
  return (
    <div className="bg-card-bg flex justify-between gap-3 text-xs md:flex-col">
      <div className="flex items-center space-x-4 md:justify-between">
        <span className="flex items-center text-zinc-600">
          <span className="rounded-2xs mr-2 inline-block size-2 bg-blue-500 md:size-3"></span>
          Paid
        </span>
        <span className="text-left font-normal text-zinc-500 md:text-right">50% · N50,000</span>
      </div>

      <div className="flex items-center space-x-4 md:justify-between">
        <span className="flex items-center text-zinc-600">
          <span className="rounded-2xs mr-2 inline-block size-2 bg-gray-300 md:size-3"></span>
          Unpaid
        </span>
        <span className="text-left font-normal text-zinc-500 md:text-right">50% · N50,000</span>
      </div>
    </div>
  );
};
