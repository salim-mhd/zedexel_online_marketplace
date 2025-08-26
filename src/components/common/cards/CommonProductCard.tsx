import CommonButton from "@/components/common/buttons/CommonButton";
import { IProduct } from "@/interfaces";

interface CommonProductCardProps {
  key?: string | number;
  productData: IProduct;
}

const CommonProductCard = ({
  key = "Coommon_Card",
  productData,
}: CommonProductCardProps) => {
  const {
    _id,
    name,
    price,
    status,
    stockQuantity,
    vendor,
    category,
    imageUrl,
  } = productData;

  return (
    <div
      key={key}
      className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col border border-[#F4F4F4]"
    >
      <div className="flex-shrink-0">
        <img
          src={imageUrl}
          alt="image"
          className="w-full h-auto sm:w-[231.75px] sm:h-[231.75px]"
        />
      </div>
      <div className="bg-[#F4F4F4] p-3 sm:p-4 flex flex-col flex-grow">
        <h3 className="font-[500] text-[#3A3D4F] mb-2 text-[15.45px] flex-grow text-nowrap overflow-hidden text-ellipsis">
          {name}
        </h3>
        <p className="text-[11.2px] text-[300] text-[var(--color-secondary)] mb-1">
          PRICE:{" "}
          <span className="text-[#3A3D4F]">
            <span className="font-[700]">$</span> {price}
          </span>
        </p>
        <p className="text-[11.2px] text-[300] text-[var(--color-secondary)] mb-1">
          Category: <span className="text-[#3A3D4F]">{category}</span>
        </p>
        <p className="text-[11.2px] text-[300] text-[var(--color-secondary)] mb-1">
          Status: <span className="text-[#3A3D4F]">{status}</span>
        </p>
        <p className="text-[11.2px] text-[300] text-[var(--color-secondary)] mb-1">
          Stock: <span className="text-[#3A3D4F]">{stockQuantity}</span>
        </p>
        <p className="text-[11.2px] text-[300] text-[var(--color-secondary)] mb-1">
          Vendor: <span className="text-[#3A3D4F]">{vendor}</span>
        </p>
        <div className="border-b border-1 border-[#BDBDBD33] mb-4" />
        <CommonButton
          label={"Send Enquiry"}
          onClick={() => console.log("Product name", name)}
          width="100%"
          height="auto"
          className="button_fill !rounded-[5.79px]"
        />
      </div>
    </div>
  );
};

export default CommonProductCard;
