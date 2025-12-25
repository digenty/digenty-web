import { CellContext, ColumnDef } from "@tanstack/react-table";

import { Avatar } from "@/components/Avatar";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { ScoreType } from "./types";

type UpdateDataFn<T> = (rowIndex: number, columnId: string, value: unknown) => void;

interface TableMeta<T> {
  updateData: UpdateDataFn<T>;
}

interface EditableCellProps<T> {
  isEditable: boolean;
  cell: CellContext<T, unknown>;
}

const EditableCell = <T,>({ isEditable, cell }: EditableCellProps<T>) => {
  const { row, column, table, getValue } = cell;
  const initialValue = getValue() as string | number | undefined;

  const [value, setValue] = useState<string | number | undefined>(initialValue);
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const meta = table.options.meta as TableMeta<T> | undefined;

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const save = () => {
    setIsEditing(false);
    if (meta?.updateData) {
      meta.updateData(row.index, column.id, value);
    }

    // Save updated data here
  };

  const cancel = () => {
    setValue(initialValue);
    setIsEditing(false);
  };

  if (isEditing && isEditable) {
    return (
      // TODO: Restrict the input type to the type of data displayed in teh cell
      <Input
        ref={inputRef}
        value={value ?? ""}
        onChange={e => setValue(e.target.value)}
        className="text-text-muted bg-bg-input-soft! h-7! w-full max-w-11 rounded-md border border-none px-2 py-1 text-sm outline-none"
        onBlur={save}
        onKeyDown={e => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") cancel();
        }}
      />
    );
  }

  // TODO: Add tooltip to tell user that he can't edit the cell if he clicks on it when isEditable is false
  return (
    <div
      className={cn("text-text-muted flex h-14 items-center justify-center text-sm font-normal", isEditable ? "cursor-text" : "cursor-pointer")}
      onClick={() => setIsEditing(true)}
    >
      <span className="max-w-2 truncate">{value}</span>
    </div>
  );
};

export const scoreColumns = (isEditable: boolean): ColumnDef<ScoreType>[] => [
  {
    accessorKey: "s/n",
    header: () => <div className="text-text-muted w-4 text-sm font-medium">S/N</div>,
    cell: ({ row }) => <span className="text-text-default h-14 w-4 cursor-pointer text-center text-sm font-normal">{row.index + 1}</span>,
    size: 50,
    maxSize: 50,
  },
  {
    accessorKey: "studentName",
    header: () => <div className="text-text-muted text-sm font-medium">Student Name</div>,
    cell: ({ row }) => (
      <div className="flex h-14 items-center justify-between gap-4 lg:pr-10">
        <div className="flex items-center gap-2">
          <Avatar username={row.original.studentName} className="size-8" url="" />
          <span className="text-text-default cursor-pointer pl-0 text-sm">{row.original.studentName}</span>
        </div>
      </div>
    ),
    size: 340,
  },
  {
    accessorKey: "ca1Score",
    header: () => <div className="text-text-muted text-center text-sm font-medium">CA 1</div>,
    cell: cell => <EditableCell<ScoreType> isEditable={isEditable} cell={cell} />,
    size: 108,
    maxSize: 108,
  },
  {
    accessorKey: "ca2Score",
    header: () => <div className="text-text-muted text-center text-sm font-medium">CA 2</div>,
    cell: cell => <EditableCell<ScoreType> isEditable={isEditable} cell={cell} />,
    size: 108,
    maxSize: 108,
  },
  {
    accessorKey: "examScore",
    header: () => <div className="text-text-muted text-center text-sm font-medium">Exam Score</div>,
    cell: cell => <EditableCell<ScoreType> isEditable={isEditable} cell={cell} />,
    size: 108,
    maxSize: 108,
  },

  {
    accessorKey: "totalScore",
    header: () => <div className="text-text-muted text-center text-sm font-medium">Total</div>,
    cell: cell => <EditableCell<ScoreType> isEditable={isEditable} cell={cell} />,
    size: 108,
    maxSize: 108,
  },
  {
    accessorKey: "grade",
    header: () => <div className="text-text-muted text-center text-sm font-medium">Grade</div>,
    cell: cell => <EditableCell<ScoreType> isEditable={isEditable} cell={cell} />,
    size: 108,
    maxSize: 108,
  },
  {
    accessorKey: "remark",
    header: () => <div className="text-text-muted text-center text-sm font-medium">Remark</div>,
    cell: cell => <EditableCell<ScoreType> isEditable={isEditable} cell={cell} />,
    size: 108,
    maxSize: 108,
  },
];
