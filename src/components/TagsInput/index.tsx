import React, { useState, KeyboardEvent, ChangeEvent } from "react";
import { Button } from "../ui/button";
import { XIcon } from "lucide-react";

interface TagInputProps {
  placeholder?: string;
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const colors = [
  "bg-bg-badge-lime text-bg-basic-lime-strong",
  "bg-bg-badge-orange text-bg-basic-orange-strong",
  "bg-bg-badge-fuchsia text-bg-basic-fuchsia-strong",
];

const TagInput: React.FC<TagInputProps> = ({ placeholder = "Add tag", tags, setTags }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const addTags = (value: string) => {
    const newTags = value
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag && !tags.includes(tag));
    if (newTags.length) {
      setTags([...new Set([...tags, ...newTags])]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTags(inputValue);
      setInputValue("");
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full space-y-1">
      <div className="bg-bg-input-soft focus-within:ring-border-highlight flex h-9 flex-wrap items-center gap-2 rounded-md border border-none px-3 focus-within:border-none focus-within:ring-2 focus-within:ring-offset-2">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="text-text-muted flex-1 bg-transparent text-sm outline-none"
        />
      </div>

      {tags.length === 0 ? (
        <p className="text-text-muted text-xs">You can add multiple tags at once by separating with a comma e.g tag 1, tag 2</p>
      ) : (
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className={`border-border-default flex items-center gap-1 rounded-md border px-1 text-xs font-medium ${colors[index % colors.length]}`}
            >
              {tag}
              <Button onClick={() => removeTag(index)} className="h-5 p-0!">
                <XIcon className="text-icon-default-muted size-3.5" />
              </Button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagInput;
