import { useState } from "react";
import { X } from "lucide-react";

export default function TagInput({ tags, onChange }) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const addTag = () => {
    const trimmedInput = inputValue.trim().replace(/,$/, "");
    if (trimmedInput && !tags.includes(trimmedInput)) {
      onChange([...tags, trimmedInput]);
      setInputValue("");
    }
  };

  const removeTag = (indexToRemove) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md focus-within:ring-1 focus-within:ring-primary focus-within:border-primary bg-white min-h-[42px] dark:border-gray-600 dark:bg-gray-800">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="flex items-center gap-1 bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-sm dark:bg-gray-700 dark:text-gray-200"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="text-gray-600 hover:text-gray-700 focus:outline-none dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          className="flex-grow min-w-[120px] outline-none border-none p-1 text-sm bg-transparent text-gray-900 dark:text-gray-100"
          placeholder={
            tags.length === 0 ? "Add tags (press Enter or comma)" : ""
          }
        />
      </div>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Press Enter or comma to add a tag
      </p>
    </div>
  );
}
