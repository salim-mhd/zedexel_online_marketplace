import { MAIN_BANNER } from "@/utils/images";
import CommonButton from "./common/buttons/CommonButton";

const Banner = () => {
  return (
    <div className="h-auto sm:h-[250px] md:h-[300px] lg:h-[323px] rounded-[18.45px] overflow-hidden bg-[#010101] flex flex-col lg:flex-row justify-center lg:justify-end items-center mt-4 sm:mt-6 md:mt-8 lg:mt-10 relative">
      <div className="flex flex-col justify-center items-center lg:items-start lg:w-[60%] px-4 sm:px-6 md:px-8 lg:px-0 lg:pr-10 text-center lg:text-left m-10">
        <div className="text-white text-lg sm:text-xl md:text-2xl font-[500] leading-tight">
          Durable Construction: The 3M 6200 half face respirator, ensuring a
          durable and long-lasting product.
        </div>
        <CommonButton
          label={"Buy Now"}
          onClick={function (): void {
            throw new Error("Function not implemented.");
          }}
          height="40px"
          width="120px"
          className="button_fill mt-3 sm:mt-4 md:mt-5"
        />
      </div>
      <img
        src={MAIN_BANNER}
        alt="3M 6200 Respirator"
        className="h-[50%] lg:h-full w-full lg:w-auto object-contain lg:object-cover"
      />
    </div>
  );
};

export default Banner;
