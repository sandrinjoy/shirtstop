import React, { useState, Fragment } from "react";
import { RiHeart3Line } from "react-icons/ri";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

import { Dialog, Transition } from "@headlessui/react";
import { RootState } from "../../app/store";

import { addItem } from "../../features/cart/cartSlice";
import { removeItem as removeItemWish } from "../../features/wishlist/wishlistSlice";
export default function WishList() {
  const dispatch = useDispatch();
  const wish = useSelector((state: RootState) => state.wishlist);
  const [isOpenWish, setIsOpenWish] = useState(false);
  return (
    <>
      {/* button */}
      <button
        onClick={() => setIsOpenWish(true)}
        aria-label="wishlist"
        className="flex flex-col items-center justify-center mx-2 text-xs font-medium transition text-neutral-900 hover:text-red-500"
      >
        <div className="relative">
          <RiHeart3Line />

          {wish.length > 0 ? (
            <span className="absolute -translate-y-2 translate-x-4 top-0 right-0 text-[10px]  text-gray-50 h-4 w-4 flex items-center justify-center rounded-full bg-red-400 p-1">
              {wish.length}
            </span>
          ) : (
            ""
          )}
          <span className="sr-only">items in wishlist, view bag</span>
        </div>
        WishList
      </button>

      {/* modal */}
      <Transition.Root show={isOpenWish} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 my-auto overflow-y-auto rounded"
          onClose={setIsOpenWish}
        >
          <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 " />
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
              <div className="inline-block w-full overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg">
                <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                  <div className="">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Your WishList
                      </Dialog.Title>
                      <div className="mt-2  max-h-[70vh] overflow-y-auto ">
                        {wish.length > 0 ? (
                          wish.map((x) => {
                            return (
                              <div
                                key={x.id}
                                className="flex w-full mx-auto mt-1 transition border-b group "
                              >
                                {/* image */}
                                <div className="relative ">
                                  <Image
                                    width={192 * 0.5}
                                    height={255 * 0.5}
                                    src={x.item.images[0].src}
                                  />
                                </div>
                                {/* details */}
                                <div className="flex flex-col gap-1 p-3">
                                  <h2 className="font-semibold text-neutral-900">
                                    {x.item.brand}
                                  </h2>
                                  <h3 className="flex items-center justify-start gap-2 text-sm text-neutral-500">
                                    <span className="flex items-center justify-center w-5 h-5 p-4 text-xs transition border rounded-full ">
                                      {x.item.size}
                                    </span>{" "}
                                    {x.item.additionalInfo}
                                  </h3>
                                  <h4 className="text-sm font-semibold text-neutral-900">
                                    {x.item.price === x.item.mrp ? (
                                      <span>Rs.{x.item.price}</span>
                                    ) : (
                                      <div className="flex items-center justify-start gap-2">
                                        <span className="">
                                          Rs.{x.item.price}
                                        </span>

                                        <span className="text-xs font-light line-through">
                                          Rs.{x.item.mrp}
                                        </span>
                                      </div>
                                    )}
                                  </h4>

                                  <button
                                    type="button"
                                    className="inline-flex justify-center w-full px-4 py-2 mt-3 text-xs font-medium text-red-600 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto "
                                    onClick={() => {
                                      dispatch(addItem(x));
                                      dispatch(removeItemWish(x));
                                    }}
                                  >
                                    Move to Cart
                                  </button>
                                  <button
                                    type="button"
                                    className="inline-flex justify-center w-full px-4 py-2 mt-3 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto "
                                    onClick={() => dispatch(removeItemWish(x))}
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-sm text-gray-500">
                            No wishlisted Items Found
                          </p>
                        )}
                      </div>
                    </div>
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
