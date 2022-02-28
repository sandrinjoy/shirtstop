import shirtsdata from "../../../public/data/pink_shirts.json";
import Header from "../../components/Header";
import Image from "next/image";
export async function getStaticPaths() {
  const paths = shirtsdata.map((item) => ({
    params: { productId: item.productId.toString() },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const product = shirtsdata.find(
    (item) => item.productId.toString() === params.productId
  );
  return {
    props: {
      product,
    },
  };
}

export default function Item({ product }) {
  return (
    <>
      <Header />
      <div className="grid md:grid-cols-2 mx-auto group flex-row mt-3    ">
        {/* image */}
        <div className=" flex flex-wrap max-h-[85vh] overflow-y-auto gap-2 justify-center items-center order-last md:order-first  ">
          {product.images.map((x, i) => {
            return x.view === "size_representation" || x.view === "search" ? (
              ""
            ) : (
              <Image
                width={192 * 1.5}
                height={255 * 1.5}
                src={x.src}
                className="transition-all duration-1000 hover:scale-110 cursor-zoom-in"
              />
            );
          })}
        </div>
        {/* details */}

        <div className="flex flex-col justify-start items-start gap-1 p-3 ">
          <h2 className=" font-bold text-2xl text-neutral-900">
            {product.brand}
          </h2>
          <h3 className="  text-lg font-light text-neutral-500 ">
            {product.additionalInfo}
          </h3>
          <div className=" text-neutral-900  px-2 py-4 my-3 font-light border ">
            <span className="font-bold"> {product.rating.toFixed(1)}</span> ⭐ |{" "}
            {product.ratingCount} Ratings
          </div>
          <h4 className=" font-semibold text-xl text-neutral-900">
            {product.price === product.mrp ? (
              <span>Rs.{product.price}</span>
            ) : (
              <div className="flex justify-start items-center gap-3">
                <span className="">Rs.{product.price}</span>
                <span className="line-through text-lg font-light">
                  Rs.{product.mrp}
                </span>
                <span className="text-red-500 font-medium text-lg">
                  {product.discountDisplayLabel}
                </span>
              </div>
            )}
          </h4>
          <span className=" text-xs text-green-500 font-semibold">
            inclusive of all taxes
          </span>

          <div className="  flex flex-col  bg-white  ">
            {/* <span className=" flex gap-1 justify-center items-center">
                      {product.sizes.split(",").map((x) => (
                        <span className="text-xs text-gray-500 border-2 border-red-300 rounded-full p-1">
                          {x}
                        </span>
                      ))}
                    </span> */}
            <span className=" my-2 font-medium">SELECT SIZE </span>
            <div className="flex justify-start items-center gap-4 my-3">
              {product.sizes.split(",").map((x, i) => {
                return (
                  <button
                    key={i}
                    className="p-5 font-bold text-sm rounded-full border w-10 h-10  flex justify-center items-center transition hover:border-red-400 cursor-pointer focus:text-red-400 focus:border-red-400"
                  >
                    {x}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex justify-start items-center gap-2 my-3">
            <button
              type="button"
              className="text-white bg-rose-700 hover:bg-rose-800 focus:ring-4 focus:ring-rose-300 font-medium rounded-lg  px-5 py-2.5 text-center mr-2 mb-2 dark:bg-rose-600 dark:hover:bg-rose-700 dark:focus:ring-rose-800 "
            >
              Add to Cart
            </button>
            <button
              type="button"
              className="py-2.5 px-5 mr-2 mb-2  font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-rose-700 focus:z-10 focus:ring-2 focus:ring-rose-700 focus:text-rose-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Wishlist
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
