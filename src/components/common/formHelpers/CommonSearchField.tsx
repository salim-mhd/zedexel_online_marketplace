import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

interface CommonSearchFieldProps {
  id?: string;
  options?: string[];
  label?: string;
  onSelect?: (option: string) => void;
  onValueChange: (query: string) => void;
  placeholder?: string;
  className?: string;
  height?: string;
  width?: string;
  noLeftRadius?: boolean;
  noRightRadius?: boolean;
  iconPosition?: "left" | "right"; // 👈 new prop
}

const CommonSearchField: React.FC<CommonSearchFieldProps> = ({
  id = "Common_SearchField",
  options,
  label,
  onSelect,
  onValueChange,
  placeholder = "Search for products",
  className,
  height = "auto",
  width = "100%",
  noLeftRadius = false,
  noRightRadius = false,
  iconPosition = "left", // 👈 default value
}) => {
  const [query, setQuery] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onValueChange(value);
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
