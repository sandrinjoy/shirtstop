import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  RiUserFill,
  RiUserLine,
  RiHeart3Fill,
  RiHeart3Line,
  RiShoppingBasketFill,
  RiShoppingBasketLine,
  RiSearch2Line,
} from "react-icons/ri";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { removeItem, addItem } from "../features/cart/cartSlice";

import { removeItem as removeItemWish } from "../features/wishlist/wishlistSlice";

function Header() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const items = useSelector((state: RootState) => state.cart);

  const wish = useSelector((state: RootState) => state.wishlist);
  const router = useRouter();
  const [isOpenCart, setIsOpenCart] = useState(false);
  const [isOpenWish, setIsOpenWish] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const sumOfItems = () => {
      let price = 0;
      items.map((x) => {
        price += parseInt(x.item.price);
      });
      setTotal(price);
    };
    sumOfItems();
  }, [items]);
  const searchFor = async (word) => {
    if (word === "") return;
    await router.push(`/?search=${word}`);
    setSearch("");
  };
  return (
    <header className="z-[9] bg-white shadow sticky top-0 w-full px-5 flex flex-col md:flex-row justify-center items-center md:justify-between  transition duration-300 ease-in-out">
      <nav
        className="
           w-full  flex  flex-col md:flex-row justify-center items-center md:justify-between max-w-[1200px] mx-auto   transition-all"
      >
        <div className="flex items-center justify-center py-2 md:py-4">
          <Link href="/" passHref>
            <a
              aria-label="homepage"
              className="flex justify-center items-center"
            >
              <Image src="/logo.svg" width={168} height={35} />
            </a>
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-around gap-5 py-3 md:py-4">
          <div className="group flex justify-center rounded-r-md gap-1  ">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              aria-label="Filter projects"
              placeholder="Search for shirts ..."
              className="appearance-none w-8/12  focus:w-full transition-all text-sm leading-6  border-none bg-slate-100 text-slate-900 placeholder:text-slate-500 rounded-md py-2  ring-1 ring-slate-200 shadow-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 dark:text-slate-100 dark:placeholder:text-slate-500 dark:ring-0 dark:focus:ring-2"
            />

            <button
              onClick={() => searchFor(search)}
              className="text-sm leading-6  border-none  text-neutral-900  rounded-md py-2  ring-1 ring-slate-200 shadow-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 dark:text-slate-100  dark:ring-0 dark:focus:ring-2 px-2"
            >
              <RiSearch2Line className="animate-wiggle group-focus-within:animate-none   text-slate-400 pointer-events-none  group-focus-within:text-blue-500 " />
            </button>
          </div>
          <div className="flex gap-1">
            <button
              aria-label="profile"
              disabled
              className={
                router.pathname.split("?")[0] === "/profile"
                  ? "text-red-600 hover:text-red-500 "
                  : "  text-neutral-900 hover:text-red-500 " +
                    " flex flex-col items-center justify-center transition font-medium text-xs mx-2"
              }
            >
              {router.pathname.split("?")[0] === "/profile" ? (
                <RiUserFill />
              ) : (
                <RiUserLine />
              )}
              Profile
            </button>
            <button
              onClick={() => setIsOpenWish(true)}
              aria-label="wishlist"
              className={
                router.pathname.split("?")[0] === "/wishlist"
                  ? "text-red-600 hover:text-red-500 "
                  : "  text-neutral-900 hover:text-red-500 " +
                    " flex flex-col items-center justify-center transition font-medium text-xs mx-2"
              }
            >
              <div className="relative">
                {router.pathname.split("?")[0] === "/cart" ? (
                  <RiHeart3Fill />
                ) : (
                  <RiHeart3Line />
                )}
                {wish.length > 0 ? (
                  <span className="absolute -translate-y-2 translate-x-4 top-0 right-0 text-[10px]  text-gray-50 h-4 w-4 flex items-center justify-center rounded-full bg-red-400 p-1">
                    {wish.length}
                  </span>
                ) : (
                  ""
                )}
                <span className="sr-only">items in wishlsit, view bag</span>
              </div>
              WishList
            </button>

            <button
              onClick={() => setIsOpenCart(true)}
              aria-label="cart"
              className={
                router.pathname.split("?")[0] === "/cart"
                  ? "text-red-600 hover:text-red-500 "
                  : "  text-neutral-900 hover:text-red-500 " +
                    " flex flex-col items-center justify-center transition font-medium text-xs mx-2"
              }
            >
              <div className="relative">
                {router.pathname.split("?")[0] === "/cart" ? (
                  <RiShoppingBasketFill />
                ) : (
                  <RiShoppingBasketLine />
                )}
                {items.length > 0 ? (
                  <span className="absolute -translate-y-2 translate-x-4 top-0 right-0 text-[10px]  text-gray-50 h-4 w-4 flex items-center justify-center rounded-full bg-red-400 p-1">
                    {items.length}
                  </span>
                ) : (
                  ""
                )}
                <span className="sr-only">items in cart, view bag</span>
              </div>
              Cart
            </button>
            <Transition.Root show={isOpenCart} as={Fragment}>
              <Dialog
                as="div"
                className="fixed z-10 inset-0 overflow-y-auto my-auto rounded"
                onClose={setIsOpenCart}
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
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full sm:max-w-lg">
                      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="">
                          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <Dialog.Title
                              as="h3"
                              className="text-lg leading-6 font-medium text-gray-900"
                            >
                              Your Cart
                            </Dialog.Title>
                            {items.length !== 0 ? (
                              <Dialog.Description className="text-sm text-gray-700">
                                Cart Total : Rs.{total}
                              </Dialog.Description>
                            ) : (
                              ""
                            )}
                            <div className="mt-2  max-h-[70vh] overflow-y-auto ">
                              {items.length > 0 ? (
                                items.map((x) => {
                                  return (
                                    <div
                                      key={x.id}
                                      className="flex mx-auto group  w-full border-b  mt-1    transition "
                                    >
                                      {/* image */}
                                      <div className=" relative">
                                        <Image
                                          width={192 * 0.5}
                                          height={255 * 0.5}
                                          src={x.item.images[0].src}
                                        />
                                      </div>
                                      {/* details */}
                                      <div className="flex flex-col gap-1 p-3">
                                        <h2 className=" font-semibold text-neutral-900">
                                          {x.item.brand}
                                        </h2>
                                        <h3 className="  text-sm text-neutral-500 flex gap-2 justify-start items-center">
                                          <span className="p-4 text-xs rounded-full border w-5 h-5  flex justify-center items-center transition ">
                                            {x.item.size}
                                          </span>{" "}
                                          {x.item.additionalInfo}
                                        </h3>
                                        <h4 className=" font-semibold text-sm text-neutral-900">
                                          {x.item.price === x.item.mrp ? (
                                            <span>Rs.{x.item.price}</span>
                                          ) : (
                                            <div className="flex justify-start items-center gap-2">
                                              <span className="">
                                                Rs.{x.item.price}
                                              </span>

                                              <span className="line-through text-xs font-light">
                                                Rs.{x.item.mrp}
                                              </span>
                                            </div>
                                          )}
                                        </h4>

                                        <button
                                          type="button"
                                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2  sm:mt-0 sm:ml-3 sm:w-auto "
                                          onClick={() =>
                                            dispatch(removeItem(x))
                                          }
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                <p className="text-sm text-gray-500">
                                  No items found in the cart
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
            <Transition.Root show={isOpenWish} as={Fragment}>
              <Dialog
                as="div"
                className="fixed z-10 inset-0 overflow-y-auto my-auto rounded"
                onClose={setIsOpenWish}
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
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full sm:max-w-lg">
                      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="">
                          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <Dialog.Title
                              as="h3"
                              className="text-lg leading-6 font-medium text-gray-900"
                            >
                              Your WishList
                            </Dialog.Title>
                            <div className="mt-2  max-h-[70vh] overflow-y-auto ">
                              {wish.length > 0 ? (
                                wish.map((x) => {
                                  return (
                                    <div
                                      key={x.id}
                                      className="flex mx-auto group  w-full border-b  mt-1    transition "
                                    >
                                      {/* image */}
                                      <div className=" relative">
                                        <Image
                                          width={192 * 0.5}
                                          height={255 * 0.5}
                                          src={x.item.images[0].src}
                                        />
                                      </div>
                                      {/* details */}
                                      <div className="flex flex-col gap-1 p-3">
                                        <h2 className=" font-semibold text-neutral-900">
                                          {x.item.brand}
                                        </h2>
                                        <h3 className="  text-sm text-neutral-500 flex gap-2 justify-start items-center">
                                          <span className="p-4 text-xs rounded-full border w-5 h-5  flex justify-center items-center transition ">
                                            {x.item.size}
                                          </span>{" "}
                                          {x.item.additionalInfo}
                                        </h3>
                                        <h4 className=" font-semibold text-sm text-neutral-900">
                                          {x.item.price === x.item.mrp ? (
                                            <span>Rs.{x.item.price}</span>
                                          ) : (
                                            <div className="flex justify-start items-center gap-2">
                                              <span className="">
                                                Rs.{x.item.price}
                                              </span>

                                              <span className="line-through text-xs font-light">
                                                Rs.{x.item.mrp}
                                              </span>
                                            </div>
                                          )}
                                        </h4>

                                        <button
                                          type="button"
                                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-xs font-medium text-red-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2  sm:mt-0 sm:ml-3 sm:w-auto "
                                          onClick={() => {
                                            dispatch(addItem(x));
                                            dispatch(removeItemWish(x));
                                          }}
                                        >
                                          Move to Cart
                                        </button>
                                        <button
                                          type="button"
                                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2  sm:mt-0 sm:ml-3 sm:w-auto "
                                          onClick={() =>
                                            dispatch(removeItemWish(x))
                                          }
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
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
