import type { NextPage, GetStaticProps } from "next";
import Image from "next/image";
import Header from "../components/Header";
import { AiOutlineCheck, AiOutlineDown } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { newItems, appendItems } from "../features/items/itemsSlice";

import { HiOutlineSelector } from "react-icons/hi";
import { useEffect, useState, Fragment } from "react";
// import shirtsdata from "../../public/data/mytra_minified.json";

import shirtsdata from "../../public/data/pink_shirts.json";
import { Dialog, Listbox, Transition } from "@headlessui/react";
import Link from "next/link";
import { RootState } from "../app/store";
import {
  changeFilter,
  changeIndex,
  changeSearch,
  changeSort,
} from "../features/itemMethods/itemMethodsSlice";
// pink shirts keys
// 0   landingPageUrl                       50 non-null     object
// 1   loyaltyPointsEnabled                 50 non-null     bool
// 2   adId                                 50 non-null     object
// 3   isPLA                                50 non-null     bool
// 4   productId                            50 non-null     int64
// 5   product                              50 non-null     object
// 6   productName                          50 non-null     object
// 7   rating                               50 non-null     float64
// 8   ratingCount                          50 non-null     int64
// 9   isFastFashion                        50 non-null     bool
// 10  futureDiscountedPrice                50 non-null     int64
// 11  futureDiscountStartDate              50 non-null     object
// 12  discount                             50 non-null     int64
// 13  brand                                50 non-null     object
// 14  searchImage                          50 non-null     object
// 15  effectiveDiscountPercentageAfterTax  50 non-null     int64
// 16  effectiveDiscountAmountAfterTax      50 non-null     int64
// 17  buyButtonWinnerSkuId                 50 non-null     int64
// 18  buyButtonWinnerSellerPartnerId       50 non-null     int64
// 19  relatedStylesCount                   50 non-null     int64
// 20  relatedStylesType                    50 non-null     object
// 21  productVideos                        50 non-null     object
// 22  inventoryInfo                        50 non-null     object
// 23  sizes                                50 non-null     object
// 24  images                               50 non-null     object
// 25  gender                               50 non-null     object
// 26  primaryColour                        50 non-null     object
// 27  discountLabel                        50 non-null     object
// 28  discountDisplayLabel                 50 non-null     object
// 29  additionalInfo                       50 non-null     object
// 30  category                             50 non-null     object
// 31  mrp                                  50 non-null     int64
// 32  price                                50 non-null     int64
// 33  advanceOrderTag                      50 non-null     object
// 34  colorVariantAvailable                50 non-null     bool
// 35  productimagetag                      50 non-null     object
// 36  listViews                            50 non-null     int64
// 37  discountType                         50 non-null     object
// 38  tdBxGyText                           50 non-null     object
// 39  catalogDate                          50 non-null     int64
// 40  season                               50 non-null     object
// 41  year                                 50 non-null     int64
// 42  isPersonalised                       50 non-null     bool
// 43  eorsPicksTag                         50 non-null     object
// 44  personalizedCoupon                   50 non-null     object
// 45  personalizedCouponValue              50 non-null     int64
// 46  productMeta                          50 non-null     object
// 47  systemAttributes                     50 non-null     object
// 48  attributeTagsPriorityList            50 non-null     object
// 49  preferredDeliveryTag                 50 non-null     object

// export async function getStaticProps() {
//   const from = 0,
//     count = 9;

//   const shirts = shirtsdata.slice(from, count);
//   return {
//     props: { shirts, currentIndex: from + count },
//   };
// }

type Filter = "All" | "Men" | "Women";
type Sort = "default" | "high" | "low";

export async function getServerSideProps(context) {
  console.log(context.query);
  //  default query values
  let {
    page = 1,
    filter = "All",
    sorting = "default",
    search = "",
  } = context.query;
  const shirts = shirtsdata;
  let sorted = shirts;
  if (filter !== "All") {
    sorted = sorted.filter((x) => x.gender === filter);
  }
  if (sorting === "low") {
    sorted = sorted.sort((a, b) => a.price - b.price);
  } else if (sorting === "high") {
    sorted = sorted.sort((a, b) => a.price - b.price);
    sorted = sorted.reverse();
  } else if (sorting === "default") {
    sorted = sorted.sort((a, b) => a.ratingCount - b.ratingCount);
    sorted = sorted.reverse();
  }
  if (search !== "") {
    sorted = sorted.filter((x) => {
      if (
        x.brand.toLowerCase().includes(search) ||
        x.productName.toLowerCase().includes(search) ||
        x.additionalInfo.toLowerCase().includes(search)
      )
        return true;
    });
  }
  const maxPages = sorted.length / 9;
  sorted = sorted.slice(page * 9 - 9, page * 9);
  return {
    props: { shirts: sorted, page, filter, sorting, search, maxPages },
  };
}
const sort = [
  { id: 1, name: "Recommended", type: "default", unavailable: false },
  { id: 2, name: "price: low to high", type: "low", unavailable: false },
  { id: 3, name: "price: high to low", type: "high", unavailable: false },
  // { id: 4, name: "discount", unavailable: false },
];

const filters = [
  { id: 1, name: "All", unavailable: false },
  { id: 2, name: "Men", unavailable: false },
  { id: 3, name: "Women", unavailable: false },
];
export default function IndexPage({
  shirts,
  page,
  filter,
  sorting,
  search,
  maxPages,
}): JSX.Element {
  const items = useSelector((state: RootState) => state.items);
  const methods = useSelector((state: RootState) => state.methods);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(newItems(shirts));
  }, []);

  const [selectedSort, setSelectedSort] = useState(sort[0]);
  const [isOpenSort, setIsOpenSort] = useState(false);

  const loadMore = async () => {
    let res = await fetch(`/api/shirtsbyfilter`, {
      method: "POST",
      body: JSON.stringify({
        from: methods.index,
        filter: methods.filter,
        sorting: methods.sorting,
        search: methods.search,
      }),
    });

    const resArray: Array<object> = await res.json();
    dispatch(appendItems(resArray));
    dispatch(changeIndex(methods.index + resArray.length));
  };
  const loadShirtsfiltered = async (fil) => {
    if (fil === methods.filter) {
      return;
    }
    let res = await fetch(`/api/shirtsbyfilter`, {
      method: "POST",
      body: JSON.stringify({
        from: 0,
        filter: fil,
        sorting: methods.sorting,
        search: methods.search,
      }),
    });
    const resArray: Array<object> = await res.json();
    dispatch(newItems(resArray));
    dispatch(changeIndex(resArray.length));
    dispatch(changeFilter(fil));
  };
  const loadShirtsSorted = async (data) => {
    if (data.type === methods.sorting) {
      return;
    }
    let res = await fetch(`/api/shirtsbyfilter`, {
      method: "POST",
      body: JSON.stringify({
        from: 0,
        filter: methods.filter,
        sorting: data.type,
        search: methods.search,
      }),
    });
    const resArray: Array<object> = await res.json();
    dispatch(newItems(resArray));

    dispatch(changeIndex(resArray.length));
    dispatch(changeSort(data.type));
    setSelectedSort(data);
  };
  return (
    <>
      <Header />
      {/* item card */}
      <section className="flex  flex-col md:flex-row border-t">
        <div className="w-64 border-r p-4 hidden md:block">
          <div className=" fixed top-auto   px-10 flex flex-col gap-4 ">
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold">Filters</h3>
              <div className="">
                <div>
                  {filters.map((x, i) => {
                    return (
                      <div className="form-check" key={i}>
                        <input
                          className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                          type="radio"
                          name="gender"
                          id={x.name}
                          checked={x.name === methods.filter}
                          onChange={() => loadShirtsfiltered(x.name)}
                        />
                        <label
                          className="form-check-label inline-block text-gray-800 text-sm font-semibold"
                          htmlFor={x.name}
                        >
                          {x.name}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold">Sort By</h3>
              <div className="w-40  top-16">
                <Listbox
                  value={selectedSort}
                  onChange={(x) => loadShirtsSorted(x)}
                >
                  <div className="relative mt-1">
                    <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                      <span className="block truncate">
                        {selectedSort.name}
                      </span>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <HiOutlineSelector />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      enter="transition duration-100 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-75 ease-out"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {sort.map((method) => (
                          <Listbox.Option
                            key={method.id}
                            value={method}
                            disabled={method.unavailable}
                            className={({ active }) =>
                              `cursor-default select-none relative py-2 pl-10 pr-4 ${
                                active
                                  ? "text-amber-900 bg-amber-100"
                                  : "text-gray-900"
                              }`
                            }
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? "font-medium" : "font-normal"
                                  }`}
                                >
                                  {method.name}
                                </span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                    <AiOutlineCheck
                                      className="w-5 h-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center md:hidden fixed bottom-0 z-[4] w-full">
          <button
            type="button"
            className=" w-full inline-flex justify-center  border-t border-r border-gray-300  px-4 py-2 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 focus:outline-none"
            onClick={() => setIsOpenSort(true)}
          >
            Sort / Filters
          </button>
          <Transition.Root show={isOpenSort} as={Fragment}>
            <Dialog
              as="div"
              className="fixed z-10 inset-0 overflow-y-auto my-auto rounded "
              onClose={setIsOpenSort}
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
                  <div className="inline-block w-full align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg ">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div className="">
                        <div className="mt-3  sm:mt-0 sm:ml-4 text-left flex flex-col gap-10">
                          {/* content */}
                          <div className="flex flex-col gap-1">
                            <h3 className="font-semibold">Sort By</h3>
                            <div className="w-full  top-16">
                              <Listbox
                                value={selectedSort}
                                onChange={(x) => loadShirtsSorted(x)}
                              >
                                <div className="relative mt-1">
                                  <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                                    <span className="block truncate">
                                      {selectedSort.name}
                                    </span>
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                      <HiOutlineSelector />
                                    </span>
                                  </Listbox.Button>
                                  <Transition
                                    as={Fragment}
                                    enter="transition duration-100 ease-out"
                                    enterFrom="transform scale-95 opacity-0"
                                    enterTo="transform scale-100 opacity-100"
                                    leave="transition duration-75 ease-out"
                                    leaveFrom="transform scale-100 opacity-100"
                                    leaveTo="transform scale-95 opacity-0"
                                  >
                                    <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                      {sort.map((method) => (
                                        <Listbox.Option
                                          key={method.id}
                                          value={method}
                                          disabled={method.unavailable}
                                          className={({ active }) =>
                                            `cursor-default select-none relative py-2 pl-10 pr-4 ${
                                              active
                                                ? "text-amber-900 bg-amber-100"
                                                : "text-gray-900"
                                            }`
                                          }
                                        >
                                          {({ selected }) => (
                                            <>
                                              <span
                                                className={`block truncate ${
                                                  selected
                                                    ? "font-medium"
                                                    : "font-normal"
                                                }`}
                                              >
                                                {method.name}
                                              </span>
                                              {selected ? (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                  <AiOutlineCheck
                                                    className="w-5 h-5"
                                                    aria-hidden="true"
                                                  />
                                                </span>
                                              ) : null}
                                            </>
                                          )}
                                        </Listbox.Option>
                                      ))}
                                    </Listbox.Options>
                                  </Transition>
                                </div>
                              </Listbox>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <h3 className="font-semibold">Filters</h3>
                            <div className="">
                              <div>
                                {filters.map((x, i) => {
                                  return (
                                    <div className="form-check" key={i}>
                                      <input
                                        className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                                        type="radio"
                                        name="gender"
                                        id={x.name}
                                        checked={x.name === methods.filter}
                                        onChange={() =>
                                          loadShirtsfiltered(x.name)
                                        }
                                      />
                                      <label
                                        className="form-check-label inline-block text-gray-800 text-sm font-semibold"
                                        htmlFor={x.name}
                                      >
                                        {x.name}
                                      </label>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
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
        <div className="w-10/12 mx-auto">
          {items.length > 0 ? (
            <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 justify-center   mx-auto gap-10 p-4">
              {items.map((x, i) => {
                return (
                  <Link href={`shirts/${x.productId}`} key={i}>
                    <div
                      key={i}
                      className="flex mx-auto group flex-col  md:flex-col max-w-[192px] hover:shadow-xl hover:shadow-neutral-300/20   transition hover:cursor-pointer"
                    >
                      {/* image */}
                      <div className=" relative">
                        <Image width={192} height={255} src={x.images[0].src} />
                        <div className=" absolute group-hover:hidden   w-full -translate-y-10  px-1 ">
                          <span className="text-xs text-neutral-900   rounded-full p-2 bg-neutral-50">
                            {x.rating.toFixed(1)} ⭐ | {x.ratingCount}
                          </span>
                        </div>
                        <div className="hidden group-hover:absolute group-hover:flex  group-hover:justify-start group-hover:items-center w-full -translate-y-10 bg-white px-1 ">
                          {/* <span className=" flex gap-1 justify-center items-center">
                      {x.sizes.split(",").map((x) => (
                        <span className="text-xs text-gray-500 border-2 border-red-300 rounded-full p-1">
                          {x}
                        </span>
                      ))}
                    </span> */}
                          <span className="text-xs text-gray-500   rounded-full p-3">
                            sizes: {x.sizes}
                          </span>
                        </div>
                      </div>
                      {/* details */}
                      <div className="flex flex-col gap-1 p-3">
                        <h2 className=" font-semibold text-neutral-900">
                          {x.brand}
                        </h2>
                        <h3 className="  text-sm text-neutral-500 ">
                          {x.additionalInfo}
                        </h3>
                        <h4 className=" font-semibold text-sm text-neutral-900">
                          {x.price === x.mrp ? (
                            <span>Rs.{x.price}</span>
                          ) : (
                            <div className="flex justify-start items-center gap-1">
                              <span className="">Rs.{x.price}</span>
                              <span className="line-through text-xs font-light">
                                Rs.{x.mrp}
                              </span>
                              <span className="text-red-500 font-light text-xs">
                                {x.discountDisplayLabel}
                              </span>
                            </div>
                          )}
                        </h4>
                      </div>
                    </div>
                  </Link>
                );
              })}
              <div className="flex justify-center items-center">
                <button
                  onClick={loadMore}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2  sm:mt-0 sm:ml-3 sm:w-auto "
                >
                  Load More
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center m-5 font-bold text-gray-700">
              No Results Found
            </div>
          )}
          <div className="mx-auto pb-10">
            <ul className="flex justify-center items-center mx-auto ">
              {Array.from(Array(parseInt(maxPages)), (e, i) => {
                {
                  return i + 1 === parseInt(page) ? (
                    <li
                      key={i}
                      className="h-10 w-10 flex justify-center items-center p-2 shadow text-white bg-neutral-800"
                    >
                      {i + 1}
                    </li>
                  ) : (
                    <li
                      key={i}
                      className="h-10 w-10 flex justify-center items-center p-2 shadow"
                    >
                      {i + 1}
                    </li>
                  );
                }
              })}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
