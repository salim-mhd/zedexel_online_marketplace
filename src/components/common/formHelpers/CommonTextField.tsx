import React, { InputHTMLAttributes } from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface CommonTextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  onValueChange?: (value: string) => void;
  height?: string;
  width?: string;
}

const CommonTextField: React.FC<CommonTextFieldProps> = ({
  id = "common_text_field",
  label,
  error,
  icon,
  iconPosition = "left",
  className,
  onValueChange,
  height = "auto",
  width = "100%",
  ...inputProps
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onValueChange) {
      onValueChange(e.target.value);
    }
    if (inputProps.onChange) {
      inputProps.onChange(e);
    }
  };

  return (
    <div className={`relative ${className}`} style={{ height, width }}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          {...inputProps}
          onChange={handleChange}
          className={`w-full border rounded-md shadow-sm py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
            error ? "border-red-500" : "border-gray-300"
          } ${icon ? (iconPosition === "left" ? "pl-10" : "pr-10") : ""}`}
        />
        {icon && (
          <span
            className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 ${
              iconPosition === "left" ? "left-3" : "right-3"
            }`}
          >
            {icon}
          </span>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1 flex items-center">
          <ErrorOutlineIcon fontSize="small" className="mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

export default CommonTextField;
