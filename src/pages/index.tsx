import { useAppDispatch } from "@/redux/hooks";
import { fetchProducts } from "@/store/slices/productSlice";
import { RootState } from "@/store/store";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounceCallback } from "@react-hook/debounce";
import Header from "@/components/Header";
import Banner from "@/components/Banner";
import CommonButton from "@/components/common/buttons/CommonButton";
import CommonProductCard from "@/components/common/cards/CommonProductCard";
import CommonDropdown from "@/components/common/formHelpers/CommonDropdown";
import CommonSearchField from "@/components/common/formHelpers/CommonSearchField";
import FilterSection from "@/components/FilterSection";
import ProductDetailsPopup from "@/components/ProductDetailsPopup";
import { categoryies, statuses } from "@/utils/const";
import { IProduct } from "@/interfaces";
import axios from "axios";
import { useSelector } from "react-redux";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  setCurrentPage,
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center items-center mt-6 sm:mt-8">
        <nav className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="text-gray-500 hover:text-gray-700 px-2 sm:px-3 py-1 rounded-md text-sm sm:text-base disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-2 sm:px-3 py-1 rounded-md text-sm sm:text-base ${
                currentPage === page
                  ? "bg-indigo-100 text-indigo-600"
                  : "text-gray-500 hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="text-gray-500 hover:text-gray-700 px-2 sm:px-3 py-1 rounded-md text-sm sm:text-base disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  );
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("Products");
  const [currentPage, setCurrentPage] = useState(1);
  const [checkedCategories, setCheckedCategories] = useState<string[]>([]);
  const [checkedStaus, setCheckedStaus] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<"latest" | "oldest">("latest");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null); // State for popup

  const { products, loading, createUpdateLoaing, error } = useSelector(
    (state: RootState) => state.product
  );

  const tabs = ["Products", "Suppliers"];

  const statusforFilter = useMemo(() => {
    return [
      { name: "All", count: products.length },
      ...statuses.map((status) => ({
        name: status,
        count: products.filter((p) => p.status === status).length,
      })),
    ];
  }, [products]);

  const categoriesforFilter = useMemo(() => {
    return [
      { name: "All", count: products.length },
      ...categoryies.map((category) => ({
        name: category,
        count: products.filter((p) => p.category === category).length,
      })),
    ];
  }, [products]);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  const dispatch = useAppDispatch();

  const fetchFilteredProducts = useCallback(
    (filters: {
      category?: string[];
      status?: string[];
      search?: string;
      sort?: "latest" | "oldest";
    }) => {
      dispatch(fetchProducts(filters));
    },
    [dispatch]
  );

  const debouncedFetch = useDebounceCallback(fetchFilteredProducts, 500);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          dispatch({
            type: "auth/login/fulfilled",
            payload: { user: res.data.user, token },
          });
        })
        .catch(() => {
          localStorage.removeItem("token");
        });
    }
  }, [dispatch]);

  useEffect(() => {
    debouncedFetch({
      category: checkedCategories,
      status: checkedStaus,
      search: searchQuery,
      sort: sortOption,
    });
  }, [checkedCategories, checkedStaus, searchQuery, sortOption, debouncedFetch]);

  return (
    <>
      <Header />
      <div className="mx-4 sm:mx-8 md:mx-16 lg:mx-[64px]">
        <Banner />
        <div className="min-h-screen">
          <div className="container mx-auto p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <aside className="w-full lg:w-1/4 lg:pr-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center my-6">
                  <h1 className="text-[20.56px] font-[500] text-[#140342]">
                    Filters
                  </h1>
                  <CommonButton
                    label={"Clear All"}
                    onClick={() => {
                      setCheckedCategories([]);
                      setCheckedStaus([]);
                    }}
                    className="button_no_fill !text-[#726C6C] !border-[#726C6C] border hover:!bg-[#726C6C] hover:!text-white"
                  />
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <FilterSection
                    key={"Status"}
                    title="Status"
                    items={statusforFilter}
                    checkedItems={checkedStaus}
                    setCheckedItems={setCheckedStaus}
                  />
                  <FilterSection
                    key={"Category"}
                    title="Category"
                    items={categoriesforFilter}
                    checkedItems={checkedCategories}
                    setCheckedItems={setCheckedCategories}
                  />
                </div>
              </aside>
              <main className="w-full lg:w-3/4">
                <div className="flex border-b border-[#BDBDBD] mb-4">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-2 px-3 sm:px-4 font-[500] text-[12px] ${
                        activeTab === tab
                          ? "bg-[#D6DCEC] rounded-t-[3px] border-b-2 border-[#304EA1] text-[#304EA1]"
                          : "text-[#BDBDBD]"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                  <p className="text-[12px] text-[#000000] font-[600]">
                    Showing Result for:{" "}
                    <span className="text-[12px] text-[#304EA1] font-[600]">
                      Road alignment planning and design
                    </span>
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                    <CommonSearchField
                      key="search_result"
                      iconPosition="right"
                      placeholder="Search"
                      onValueChange={(query: string) => {
                        setSearchQuery(query);
                      }}
                    />
                    <CommonDropdown
                      key="dropdown_result"
                      options={["latest", "oldest"]}
                      value={sortOption}
                      onSelect={(option: string) =>
                        setSortOption(option as "latest" | "oldest")
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {currentProducts.map((product, index) => (
                    <div
                      key={product?._id || index}
                      onClick={() => setSelectedProduct(product)} // Trigger popup
                      className="cursor-pointer"
                    >
                      <CommonProductCard productData={product} />
                    </div>
                  ))}
                </div>
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              </main>
            </div>
          </div>
        </div>
      </div>
      {selectedProduct && (
        <ProductDetailsPopup
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)} // Close popup
        />
      )}
    </>
  );
}