interface CommonButtonProps {
  label: string;
  onClick?: () => void;
  className?: string;
  height?: string;
  width?: string;
  noLeftRadius?: boolean;
  noRightRadius?: boolean;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset"; // ✅ add type
}

const CommonButton: React.FC<CommonButtonProps> = ({
  label,
  onClick,
  className = "",
  height = "40px",
  width = "99.17px",
  disabled = false,
  loading = false,
  type = "button", // default type
}) => {
  return (
    <button
      type={type} // ✅ use the type here
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full rounded-full shadow-sm ${
        className ? "" : "button_fill text-white"
      } px-4 py-2 text-center flex justify-center items-center ${className}`}
      style={{ height, width }}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          Loading...
        </span>
      ) : (
        label
      )}
    </button>
  );
};

export default CommonButton;
