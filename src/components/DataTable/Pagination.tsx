import { Table } from "@tanstack/react-table";
import { Button } from "../ui/button";

interface Pagination {
  type?: string;
  page?: number;
  isActive?: boolean;
}

interface Props<TData> {
  table: Table<TData>;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export const Pagination = <TData,>({ table, currentPage, totalPages, setCurrentPage }: Props<TData>) => {
  return (
    <div className="text-text-muted flex items-center justify-between px-8 font-normal">
      <div>
        {currentPage} of {totalPages} results
      </div>

      <div className="flex gap-1">
        <Button
          className="bg-bg-state-soft text-text-subtle h-8 px-3.5"
          disabled={!table.getCanPreviousPage()}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Prev
        </Button>

        <Button
          className="bg-bg-state-soft text-text-subtle h-8 px-3.5"
          disabled={!table.getCanNextPage()}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
