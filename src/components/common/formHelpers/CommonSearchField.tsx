import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";

interface CommonSearchFieldProps {
  id?: string;
  options?: string[];
  label?: string;
  onSelect?: (option: string) => void;
  onValueChange: (value: string) => void;
  value?: string; // ✅ controlled value
  placeholder?: string;
  className?: string;
  height?: string;
  width?: string;
  noLeftRadius?: boolean;
  noRightRadius?: boolean;
  iconPosition?: "left" | "right";
}

const CommonSearchField: React.FC<CommonSearchFieldProps> = ({
  id = "Common_SearchField",
  options,
  label,
  onSelect,
  onValueChange,
  value, // controlled
  placeholder = "Search for products",
  className,
  height = "auto",
  width = "100%",
  noLeftRadius = false,
  noRightRadius = false,
  iconPosition = "left",
}) => {
  const [query, setQuery] = useState<string>(value || "");

  // ✅ keep internal state in sync if value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setQuery(value);
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onValueChange(val);
  };

  return (
    <div className={`relative ${className}`} style={{ height, width }}>
      {label && (
        <label className="block text-[14px] font-medium text-[#6A6A6A] mb-1">
          {label}
        </label>
      )}
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={`w-full bg-white py-2 border border-[#6A6A6A] ${
          noLeftRadius
            ? "rounded-r-sm border-l-0"
            : noRightRadius
            ? "rounded-l-sm border-r-0"
            : "rounded-sm"
        } shadow-sm ${
          iconPosition === "left" ? "pl-8 pr-4" : "pl-4 pr-8"
        } py-1 text-[14px] text-left text-gray-700 focus:outline-none`}
      />

      {/* icon container */}
      {iconPosition === "left" ? (
        <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400">
          <SearchIcon fontSize="small" />
        </span>
      ) : (
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400">
          <SearchIcon fontSize="small" />
        </span>
      )}
    </div>
  );
};

export default CommonSearchField;
