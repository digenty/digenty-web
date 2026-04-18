import { Assessment, Grading } from "@/api/types";
import { Avatar } from "@/components/Avatar";
import { cn } from "@/lib/utils";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { ScoreType } from "./types";
import { toast } from "../Toast";

type UpdateDataFn<T> = (rowIndex: number, columnId: string, value: unknown) => void;

interface TableMeta<T> {
  updateData: UpdateDataFn<T>;
}

interface EditableCellProps<T> {
  isEditable: boolean;
  cell: CellContext<T, unknown>;
  maxWeight: number;
}

const EditableCell = <T,>({ isEditable, cell, maxWeight }: EditableCellProps<T>) => {
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
    if (value && Number(value) > maxWeight) {
      setValue(0);
      toast({
        title: "Invalid Score",
        description: `Score cannot be greater than ${maxWeight}`,
        type: "error",
      });
      return;
    }

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
        value={value}
        type="number"
        onChange={e => setValue(e.target.value)}
        className="text-text-muted bg-bg-input-soft! h-7! w-full max-w-11 [appearance:textfield] rounded-md border border-none px-2 py-1 text-sm outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
      onClick={() => isEditable && setIsEditing(true)}
    >
      <span className="truncate">{value}</span>
    </div>
  );
};

export const scoreColumns = (isEditable: boolean, columns: Assessment[], gradings: Grading[]): ColumnDef<ScoreType>[] => [
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
          <Avatar className="size-8" url="" />
          <span className="text-text-default cursor-pointer pl-0 text-sm">{row.original.studentName}</span>
        </div>
      </div>
    ),
    size: 340,
  },

  ...columns.map(column => ({
    id: String(column.assessmentName),
    accessorFn: (row: ScoreType) => row.assessmentScores[column.assessmentName]?.score,
    header: () => (
      <div className="text-text-muted text-center text-sm font-medium">
        {column.assessmentName} <span className="text-text-muted text-center text-xs font-light">({column.weight})</span>
      </div>
    ),
    cell: (cell: CellContext<ScoreType, unknown>) => <EditableCell<ScoreType> isEditable={isEditable} cell={cell} maxWeight={column.weight} />,
    size: 108,
    maxSize: 108,
  })),

  {
    accessorKey: "total",
    header: () => <div className="text-text-muted text-center text-sm font-medium">Total</div>,
    cell: ({ row }) => {
      const totalScore = Object.values(row.original.assessmentScores).reduce((sum, assessment) => sum + assessment.score, 0);

      return (
        <div className={cn("text-text-muted flex h-14 items-center justify-center text-sm font-normal")}>
          <span className="truncate">{totalScore}</span>
        </div>
      );
    },
    size: 108,
    maxSize: 108,
  },
  {
    accessorKey: "grade",
    header: () => <div className="text-text-muted text-center text-sm font-medium">Grade</div>,
    cell: ({ row }) => {
      const totalScore = Object.values(row.original.assessmentScores).reduce((sum, assessment) => sum + assessment.score, 0);
      const gradeValue = gradings.find(grade => grade.lowerLimit <= totalScore && grade.upperLimit >= totalScore)?.grade;

      return (
        <div className={cn("text-text-muted flex h-14 items-center justify-center text-sm font-normal")}>
          <span className="truncate">{gradeValue}</span>
        </div>
      );
    },
    size: 108,
    maxSize: 108,
  },
  {
    accessorKey: "remark",
    header: () => <div className="text-text-muted text-center text-sm font-medium">Remark</div>,
    cell: ({ row }) => {
      const totalScore = Object.values(row.original.assessmentScores).reduce((sum, assessment) => sum + assessment.score, 0);
      const remarkValue = gradings.find(grade => grade.lowerLimit <= totalScore && grade.upperLimit >= totalScore)?.remark;

      return (
        <div className={cn("text-text-muted flex h-14 items-center justify-center text-sm font-normal")}>
          <span className="truncate">{remarkValue}</span>
        </div>
      );
    },
    size: 108,
    maxSize: 108,
  },
];
