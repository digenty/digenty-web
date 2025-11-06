"use client";
import TagsInput from "../../TagsInput";
import { Label } from "../../ui/label";

export const Tags = ({ tags, setTags }: { tags: string[]; setTags: React.Dispatch<React.SetStateAction<string[]>> }) => {
  return (
    <div className="border-border-default space-y-6 border-b py-6">
      <h2 className="text-lg font-semibold">Tag</h2>

      <div className="grid grid-cols-1 gap-6 sm:gap-5">
        <div className="space-y-2">
          <Label htmlFor="tags" className="text-text-default text-sm font-medium">
            Tag
          </Label>
          <TagsInput tags={tags} setTags={setTags} />
        </div>
      </div>
    </div>
  );
};
