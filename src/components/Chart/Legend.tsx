export const Legend = () => {
  return (
    <div className="flex justify-between gap-3 text-xs md:flex-col">
      <div className="flex items-center space-x-4 md:justify-between">
        <span className="text-text-subtle flex items-center">
          <span className="rounded-2xs bg-bg-basic-blue-accent mr-2 inline-block size-2 md:size-3"></span>
          Paid
        </span>
        <span className="text-text-muted text-left font-normal md:text-right">50% · N50,000</span>
      </div>

      <div className="flex items-center space-x-4 md:justify-between">
        <span className="text-text-subtle flex items-center">
          <span className="rounded-2xs mr-2 inline-block size-2 bg-gray-300 md:size-3"></span>
          Unpaid
        </span>
        <span className="text-text-muted text-left font-normal md:text-right">50% · N50,000</span>
      </div>
    </div>
  );
};
