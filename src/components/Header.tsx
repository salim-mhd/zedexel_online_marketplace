import CommonButton from "@/components/common/buttons/CommonButton";
import CommonDropdown from "@/components/common/formHelpers/CommonDropdown";
import CommonSearchField from "@/components/common/formHelpers/CommonSearchField";
import { MAIN_LOGO } from "@/utils/images";
import { useEffect, useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import { NextRouter, useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { logout } from "@/store/slices/authSlice"; // Assuming you have a logout action

interface HeaderTopProps {
  router: NextRouter;
}

// Top section with logo, search, and buttons
const HeaderTop = ({ router }: HeaderTopProps) => {
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout()); // clear Redux + localStorage
    router.push("/login"); // navigate after 1 second
  };

  return (
    <div className="h-auto flex flex-col md:flex-row justify-between items-center px-4 py-4 md:h-[80px] md:px-8 lg:px-16">
      <img
        src={MAIN_LOGO}
        alt="Logo"
        className="w-[150px] md:w-[195.12px] h-auto order-1"
      />
      <div className="w-full md:w-[400px] lg:w-[505px] flex order-3 md:order-2 md:mx-2 md:mt-0 mt-4">
        <CommonDropdown
          key="header_CommonDropdown"
          options={["Products", "Products1", "Products2"]}
          onSelect={(option) => console.log("option", option)}
          width="30%"
          noRightRadius
          className="border-r-1"
        />
        <CommonSearchField
          options={[
            "hello",
            "test",
            "test1",
            "test2",
            "test3",
            "test4",
            "test5",
            "test6",
          ]}
          onSelect={function (option: string): void {
            throw new Error("Function not implemented.");
          }}
          onSearch={function (query: string): void {
            throw new Error("Function not implemented.");
          }}
          width="70%"
          noLeftRadius
        />
      </div>
      <div className="flex gap-2 md:gap-4 mt-4 md:mt-0 order-2 md:order-3">
        {user ? (
          <>
            <CommonButton
              className="button_fill text-sm md:text-base"
              label="Add Product"
              onClick={() => router.push("/createProduct")} // Adjust the route as needed
              width="100%"
            />
            <CommonButton
              className="button_no_fill text-sm md:text-base"
              label="Logout"
              onClick={handleLogout}
              loading={loading}
            />
          </>
        ) : (
          <>
            <CommonButton
              className="button_fill text-sm md:text-base"
              label="Register"
              onClick={() => router.push("/register")}
            />
            <CommonButton
              className="button_no_fill text-sm md:text-base"
              label="Login"
              onClick={() => router.push("/login")}
            />
          </>
        )}
      </div>
    </div>
  );
};

// Navigation section with page links
const HeaderNav = ({
  selectedPage,
  handleSelectPage,
}: {
  selectedPage: string;
  handleSelectPage: (page: string) => void;
}) => (
  <div className="h-auto py-2 md:h-[48px] md:py-0 bg_primary flex flex-wrap justify-start items-center gap-4 md:gap-[35px] px-4 md:pl-[64px]">
    {[
      "Products",
      "Suppliers",
      "Services",
      "Service Providers",
      "RFQ Marketplace",
    ].map((page) => (
      <div
        key={page}
        className={`text-[12px] md:text-[14px] text_color font-[400] cursor-pointer ${
          selectedPage === page ? "underline" : "hover:underline"
        }`}
        onClick={() => handleSelectPage(page)}
      >
        {page}
      </div>
    ))}
  </div>
);

// Breadcrumb section
const HeaderBreadcrumb = ({ selectedPage }: { selectedPage: string }) => (
  <div className="h-[64px] bg-[#F2F2F2] flex justify-start items-center gap-[10px] px-4 md:pl-[80px]">
    <HomeIcon fontSize="small" className="text-[#BDBDBD]" />
    <div className="font-roboto font-light text-[14px] md:text-[16px] leading-[150%] tracking-[0.015em] text-[#424242]">
      Home
    </div>
    <div className="font-roboto font-light text-[14px] md:text-[16px] leading-[150%] tracking-[0.015em] text-[#424242]">
      / {selectedPage}
    </div>
  </div>
);

// Main Header component
const Header = () => {
  const [selectedPage, setSelectedPage] = useState<string>("Products");
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const handleSelectPage = (pageName: string) => {
    setSelectedPage(pageName);
    localStorage.setItem("selectedPage", pageName);
  };

  useEffect(() => {
    const savedPage = localStorage.getItem("selectedPage");
    if (savedPage) {
      setSelectedPage(savedPage);
    } else {
      localStorage.setItem("selectedPage", "Products");
    }
  }, []);

  return (
    <>
      <HeaderTop router={router} />
      <HeaderNav
        selectedPage={selectedPage}
        handleSelectPage={handleSelectPage}
      />
      <HeaderBreadcrumb selectedPage={selectedPage} />
    </>
  );
};

export default Header;
