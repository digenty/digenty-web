export const Legend = () => {
  return (
    <div className="bg-card-bg flex md:flex-col justify-between gap-3 text-xs">
      <div className="flex items-center md:justify-between space-x-4">
        <span className="flex items-center text-zinc-600">
          <span className="rounded-2xs mr-2 inline-block size-2 md:size-3 bg-blue-500"></span>
          Paid
        </span>
        <span className="text-left md:text-right font-normal text-zinc-500">50% · N50,000</span>
      </div>

      <div className="flex items-center md:justify-between space-x-4">
        <span className="flex items-center text-zinc-600">
          <span className="rounded-2xs mr-2 inline-block size-2 md:size-3 bg-gray-300"></span>
          Unpaid
        </span>
        <span className="text-left md:text-right font-normal text-zinc-500">50% · N50,000</span>
      </div>
    </div>
  );
};
