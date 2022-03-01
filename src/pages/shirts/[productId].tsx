import shirtsdata from "../../../public/data/pink_shirts.json";
import Header from "../../components/Header";
import Image from "next/image";
import { nanoid } from "nanoid";
import { useDispatch, useSelector } from "react-redux";
import { useState, Fragment } from "react";
import { addItem as addItemtoCart } from "../../features/cart/cartSlice";

import { addItem as addItemtoWishList } from "../../features/wishlist/wishlistSlice";

import { Dialog, Transition } from "@headlessui/react";
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
  const dispatch = useDispatch();
  const pSizes = product.sizes.split(",");
  const [mySize, setMySize] = useState(pSizes[0]);
  const [isImageModal, setIsImageModal] = useState(false);
  const [modalImage, setModalImage] = useState(product.images[0].src);
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
                onClick={() => {
                  setModalImage(x.src);
                  setIsImageModal(true);
                }}
              />
            );
          })}
        </div>
        {/* details */}

        <div className="flex flex-col justify-start items-start gap-1 p-3 ">
          <h2 className=" font-bold text-2xl text-neutral-900">
            {product.brand}
          </h2>
          <h3 className="  text-sm font-light text-neutral-700 ">
            {product.productName}
          </h3>
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
                    onClick={() => setMySize(x)}
                    className={
                      mySize === x
                        ? "p-5 font-bold text-sm rounded-full border w-10 h-10  flex justify-center items-center transition hover:border-red-400 cursor-pointer focus:text-red-400 focus:border-red-400 text-red-400 border-red-400"
                        : "p-5 font-bold text-sm rounded-full border w-10 h-10  flex justify-center items-center transition hover:border-red-400 cursor-pointer focus:text-red-400 focus:border-red-400"
                    }
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
              onClick={() =>
                dispatch(
                  addItemtoCart({
                    id: nanoid(),
                    item: { ...product, size: mySize },
                  })
                )
              }
              className="text-white bg-rose-700 hover:bg-rose-800 focus:ring-4 focus:ring-rose-300 font-medium rounded-lg  px-5 py-2.5 text-center mr-2 mb-2 dark:bg-rose-600 dark:hover:bg-rose-700 dark:focus:ring-rose-800 "
            >
              Add to Cart
            </button>
            <button
              type="button"
              className="py-2.5 px-5 mr-2 mb-2  font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-rose-700 focus:z-10 focus:ring-2 focus:ring-rose-700 focus:text-rose-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              onClick={() =>
                dispatch(
                  addItemtoWishList({
                    id: nanoid(),
                    item: { ...product, size: mySize },
                  })
                )
              }
            >
              Wishlist
            </button>
          </div>
        </div>
      </div>
      <Transition.Root show={isImageModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto my-auto rounded"
          onClose={setIsImageModal}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity " />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom  rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className=" max-h-screen">
                  <button
                    className="r-0 w-full inline-flex justify-center   border-gray-300 shadow-sm px-4 py-2 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none  "
                    onClick={() => setIsImageModal(false)}
                  >
                    close
                  </button>
                  <div className="relative">
                    <img src={modalImage} className="" />
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
