import React, { useState } from "react";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";

interface FilterItem {
  name: string;
  count: number;
}

interface FilterSectionProps {
  title: string;
  items: FilterItem[];
  checkedItems: string[];
  setCheckedItems: React.Dispatch<React.SetStateAction<string[]>>;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  items,
  checkedItems,
  setCheckedItems,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const toggleSection = () => setIsOpen(!isOpen);
  const toggleShowAll = () => setShowAll(!showAll);

  const handleCheckboxChange = (name: string) => {
    if (name === "All") {
      // If All is clicked
      if (checkedItems.includes("All")) {
        setCheckedItems([]); // Uncheck all
      } else {
        setCheckedItems(items.map((item) => item.name)); // Check all
      }
      return;
    }

    let newChecked: string[] = [];
    if (checkedItems.includes(name)) {
      // Uncheck item
      newChecked = checkedItems.filter((c) => c !== name && c !== "All");
    } else {
      // Check item
      newChecked = [...checkedItems.filter((c) => c !== "All"), name];
    }

    // If all individual items are checked, include "All"
    const allItemsExceptAll = items
      .filter((i) => i.name !== "All")
      .map((i) => i.name);
    if (allItemsExceptAll.every((i) => newChecked.includes(i))) {
      newChecked = ["All", ...allItemsExceptAll];
    }

    setCheckedItems(newChecked);
  };

  const displayedItems = showAll ? items : items.slice(0, 2);

  return (
    <div>
      {/* Header */}
      <div
        className="flex justify-between items-center mb-3 sm:mb-4 cursor-pointer"
        onClick={toggleSection}
      >
        <h2 className="text-[20.43px] font-[500] text-[#304EA1]">{title}</h2>
        {isOpen ? (
          <KeyboardArrowUp fontSize="medium" className="text-[#304EA1]" />
        ) : (
          <KeyboardArrowDown fontSize="medium" className="text-[#304EA1]" />
        )}
      </div>

      {/* Items */}
      {isOpen && (
        <div className="space-y-4 sm:space-y-4 mt-5">
          {displayedItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <label className="flex items-center text-gray-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  checked={checkedItems.includes(item.name)}
                  onChange={() => handleCheckboxChange(item.name)}
                />
                <span className="ml-2 text-[14.3px] text-[#304EA1]">
                  {item.name}
                </span>
              </label>
              <span className="text-[14.3px] text-[#4F547B]">
                ({item.count})
              </span>
            </div>
          ))}

          {/* Show more / Hide */}
          {items.length > 2 && (
            <button
              className="text-[14.3px] text-[#4983FF]"
              onClick={toggleShowAll}
            >
              {showAll ? "Hide" : "Show more"}
            </button>
          )}

          <div className="mb-2 sm:mb-5 border border-gray-300"></div>
        </div>
      )}
    </div>
  );
};

export default FilterSection;
