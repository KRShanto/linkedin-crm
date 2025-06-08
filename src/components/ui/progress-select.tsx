import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProgressSelectProps {
  value: string;
  onValueChange?: (value: string) => void;
  options: { value: string; label: string; step?: number; total?: number }[];
  showProgress?: boolean;
  disabled?: boolean;
  className?: string;
}

const ProgressSelect = React.forwardRef<HTMLDivElement, ProgressSelectProps>(
  (
    { className, options, showProgress = true, value, onValueChange, disabled },
    ref
  ) => {
    const selectedOption = options.find((opt) => opt.value === value);
    const progress =
      selectedOption?.step && selectedOption?.total
        ? (selectedOption.step / selectedOption.total) * 100
        : 0;

    return (
      <div ref={ref} className={cn("relative", className)}>
        {showProgress && selectedOption?.step && selectedOption?.total && (
          <div className="absolute left-0 right-0 -top-6 flex items-center gap-2 text-sm">
            <div className="h-2 flex-1 rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
              {selectedOption.step}/{selectedOption.total}
            </span>
          </div>
        )}
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
          <SelectTrigger
            className={cn(
              "w-full transition-colors",
              value === "Cancelled" && "text-red-600 dark:text-red-400",
              selectedOption?.step === selectedOption?.total &&
                "text-green-600 dark:text-green-400"
            )}
          >
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className={cn(
                  "transition-colors",
                  option.value === "Cancelled" &&
                    "text-red-600 dark:text-red-400",
                  option.step === option.total &&
                    "text-green-600 dark:text-green-400"
                )}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
);

ProgressSelect.displayName = "ProgressSelect";

export { ProgressSelect };
