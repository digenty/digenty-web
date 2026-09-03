import { SkillRating } from "@/api/types";
import { Avatar } from "@/components/Avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CellContext, ColumnDef } from "@tanstack/react-table";

export type DevelopmentRow = {
  studentId: number;
  studentName: string;
  [skillColumnId: string]: string | number;
};

interface TableMeta {
  updateData: (rowIndex: number, columnId: string, value: unknown) => void;
}

const RatingCell = ({ cell, editable }: { cell: CellContext<DevelopmentRow, unknown>; editable: boolean }) => {
  const { row, column, table, getValue } = cell;
  const value = getValue() as string | undefined;
  const meta = table.options.meta as TableMeta | undefined;

  if (!editable) {
    return <span className="text-text-default text-sm">{value || "-"}</span>;
  }

  return (
    <Select value={value ?? ""} onValueChange={val => meta?.updateData(row.index, column.id, val)}>
      <SelectTrigger className="bg-bg-card! text-text-default mx-auto h-8 w-16 rounded-md border px-2 py-1 text-center text-sm font-normal">
        <SelectValue placeholder="-" />
      </SelectTrigger>
      <SelectContent className="bg-bg-default border-border-default">
        {[5, 4, 3, 2, 1].map(rating => (
          <SelectItem key={rating} value={String(rating)} className="text-text-default text-sm">
            {rating}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export const skillColumnId = (skill: SkillRating, index: number) => (skill.skillId ? String(skill.skillId) : `skill-${index}`);

export const developmentColumns = (skills: SkillRating[], editable: boolean): ColumnDef<DevelopmentRow>[] => [
  {
    accessorKey: "s/n",
    header: () => <div className="text-text-muted w-4 text-sm font-medium">S/N</div>,
    cell: ({ row }) => <span className="text-text-default inline-block text-center text-sm">{row.index + 1}</span>,
    size: 50,
    maxSize: 60,
  },
  {
    accessorKey: "studentName",
    header: () => <div className="text-text-muted flex justify-start text-sm font-medium">Student Name</div>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar className="size-8" />
        <span className="text-text-default text-sm">{row.original.studentName}</span>
      </div>
    ),
    size: 280,
  },

  ...skills.map((skill, index) => ({
    id: skillColumnId(skill, index),
    accessorFn: (row: DevelopmentRow) => row[skillColumnId(skill, index)],
    header: () => <div className="text-text-muted flex justify-center text-center text-sm font-medium">{skill.skillName ?? "Skill"}</div>,
    cell: (cell: CellContext<DevelopmentRow, unknown>) => <RatingCell cell={cell} editable={editable} />,
    size: 140,
  })),
];
