import type { NextPage, GetStaticProps } from "next";
import Image from "next/image";
import Header from "../components/Header";
import { AiOutlineCheck, AiOutlineDown } from "react-icons/ai";

import { HiOutlineSelector } from "react-icons/hi";
import { useEffect, useState, Fragment } from "react";
// import shirtsdata from "../../public/data/mytra_minified.json";

import shirtsdata from "../../public/data/pink_shirts.json";
import { Listbox, Transition } from "@headlessui/react";
import Link from "next/link";
// interface Shirt {
//   Brand: string;
//   Title: string;
//   SellingPrice: number;
//   Price: number | string;
//   Discount: string;
// }
// type Shirts = Shirt[];

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
export async function getStaticProps() {
  const from = 0,
    count = 9;

  const shirts = shirtsdata.slice(from, count);
  return {
    props: { shirts, currentIndex: from + count },
  };
}
const sort = [
  { id: 1, name: "default", type: "default", unavailable: false },
  { id: 2, name: "price: low to high", type: "low", unavailable: false },
  { id: 3, name: "price: high to low", type: "high", unavailable: false },
  // { id: 4, name: "discount", unavailable: false },
];
type Filter = "All" | "Men" | "Women";
const filters = [
  { id: 1, name: "All", unavailable: false },
  { id: 2, name: "Men", unavailable: false },
  { id: 3, name: "Women", unavailable: false },
];
export default function IndexPage({ shirts, currentIndex }): JSX.Element {
  const [items, setItems] = useState(shirts);
  const [filter, setFilter] = useState("All");
  const [sorting, setSorting] = useState("default");
  const [selectedSort, setSelectedSort] = useState(sort[0]);
  const [index, setIndex] = useState(currentIndex);
  const loadMore = async () => {
    let res = await fetch(`/api/shirtsbyfilter`, {
      method: "POST",
      body: JSON.stringify({ from: index, filter, sorting }),
    });

    const resArray: Array<object> = await res.json();

    setItems((x) => [...x, ...resArray]);
    setIndex(index + resArray.length);
  };
  const loadShirtsfiltered = async (fil) => {
    if (fil === filter) {
      return;
    }
    let res = await fetch(`/api/shirtsbyfilter`, {
      method: "POST",
      body: JSON.stringify({ from: 0, filter: fil, sorting }),
    });
    const resArray: Array<object> = await res.json();
    setItems((x) => [...resArray]);
    setIndex(resArray.length);

    setFilter(fil);
  };
  const loadShirtsSorted = async (data) => {
    if (data.type === sorting) {
      return;
    }
    let res = await fetch(`/api/shirtsbyfilter`, {
      method: "POST",
      body: JSON.stringify({ from: 0, filter, sorting: data.type }),
    });
    const resArray: Array<object> = await res.json();
    setItems((x) => [...resArray]);
    setIndex(resArray.length);
    setSorting(data.type);
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
                          checked={x.name === filter}
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
        <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 justify-center  w-10/12 mx-auto gap-10 p-4">
          {items.map((x, i) => {
            return (
              <Link href={`shirts/${x.productId}`}>
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
              className="inline-block px-6 py-2.5 bg-blue-500  text-white font-medium text-xs leading-tight uppercase rounded shadow-md focus:bg-blue-600 hover:shadow-lg  focus:shadow-lg focus:outline-none active:bg-blue-700 focus:ring-0  transition duration-150 ease-in-out"
            >
              Load More
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
