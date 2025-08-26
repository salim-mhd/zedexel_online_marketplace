import { useState, useEffect, useRef } from "react";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import COLORS from "@/utils/colors";

interface CommonDropdownProps {
  id?: string;
  options: string[];
  label?: string;
  value?: string;
  onSelect: (option: string) => void;
  className?: string;
  height?: string;
  width?: string;
  noLeftRadius?: boolean;
  noRightRadius?: boolean;
  error?: string;
}

const CommonDropdown: React.FC<CommonDropdownProps> = ({
  id = "Common_Dropdown",
  options,
  label,
  onSelect,
  value = "",
  className,
  height = "auto",
  width = "100%",
  noLeftRadius = false,
  noRightRadius = false,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(value || options[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
    onSelect(option);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    // Add event listener when dropdown opens
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup event listener on unmount or when dropdown closes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      key={id}
      ref={dropdownRef}
      className={`relative inline-block ${className}`}
      style={{ height, width }}
    >
      {label && (
        <label className="block text-[14px] font-[500] text-[#6A6A6A] mb-1">
          {label}
        </label>
      )}
      <div className="relative text-center">
        <button
          type="button"
          className={`w-full text-[14px] bg-white border ${
            error ? "border-red-500" : "border-[#6a6a6a]"
          } ${
            noLeftRadius
              ? "rounded-r-sm border-l-0"
              : noRightRadius
              ? "rounded-l-sm border-r-0"
              : "rounded-sm"
          } shadow-sm pl-4 pe-[50px] py-2 text-left text-gray-700 focus:outline-none`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedOption}
          <span className="absolute inset-y-0 right-0 flex items-center pe-3 pointer-events-none">
            {isOpen ? (
              <KeyboardArrowUp fontSize="small" />
            ) : (
              <KeyboardArrowDown fontSize="small" />
            )}
          </span>
        </button>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
            {options.map((option) => (
              <div
                key={option}
                className={`px-4 py-2 text-[14px] main_hover ${
                  option === selectedOption
                    ? "text-white bg-[var(--color-primary)]"
                    : ""
                }`}
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-[12px] text-red-500">{error}</p>}
    </div>
  );
};

export default CommonDropdown;
