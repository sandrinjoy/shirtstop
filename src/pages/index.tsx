import Image from "next/image";
import Header from "../components/Navbar/Header";
import { AiOutlineCheck, AiOutlineClose, AiOutlineHome } from "react-icons/ai";
import { GoSettings } from "react-icons/go";

import { HiOutlineSelector } from "react-icons/hi";
import { useState, Fragment } from "react";
import shirtsdata from "../../public/data/pink_shirts.json";
import { Dialog, Listbox, Transition } from "@headlessui/react";
import Link from "next/link";

import { useRouter } from "next/router";

export async function getServerSideProps(context) {
  // define the number of results want to be sent
  let count = 9;
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
        x.brand.toLowerCase().includes(search.toLowerCase()) ||
        x.productName.toLowerCase().includes(search.toLowerCase()) ||
        x.additionalInfo.toLowerCase().includes(search.toLowerCase())
      )
        return true;
    });
  }
  const maxPages = sorted.length / count;
  const total = sorted.length;
  sorted = sorted.slice(page * count - count, page * count);
  return {
    props: { shirts: sorted, page, filter, sorting, search, maxPages, total },
  };
}

export const sort = [
  { id: 1, name: "Recommended", type: "default", unavailable: false },
  { id: 2, name: "price: low to high", type: "low", unavailable: false },
  { id: 3, name: "price: high to low", type: "high", unavailable: false },
];
export const filters = [
  { id: 1, name: "All", unavailable: false },
  { id: 2, name: "Men", unavailable: false },
  { id: 3, name: "Women", unavailable: false },
];
type Filter = "All" | "Men" | "Women";
type Sort = "default" | "high" | "low";
export default function IndexPage({
  shirts,
  page,
  filter,
  sorting,
  search,
  maxPages,
  total,
}): JSX.Element {
  const [selectedSort, setSelectedSort] = useState(sort[0]);
  const [isOpenSort, setIsOpenSort] = useState(false);
  const router = useRouter();
  const createUrlString = ({
    tpage = page,
    tfilter = filter,
    tsorting = sorting,
    tsearch = search,
  }) => {
    let url = "/?";
    let isFirst = false;
    if (tsearch !== "") {
      isFirst = true;
      url += `search=${tsearch}`;
    }
    if (tpage !== 1) {
      if (isFirst) url += "&";
      else isFirst = true;
      url += `page=${tpage}`;
    }
    if (tsorting !== "default") {
      if (isFirst) url += "&";
      else isFirst = true;
      url += `sorting=${tsorting}`;
    }
    if (tfilter !== "All") {
      if (isFirst) url += "&";
      else isFirst = true;
      url += `filter=${tfilter}`;
    }
    return url;
  };
  const loadPage = (pnum: number) => {
    if (pnum === parseInt(page)) {
      return;
    }
    const q = router.query;
    const url = createUrlString({ tpage: pnum });
    router.push(`${url}`);
  };

  const loadShirtsfiltered = (fil: string) => {
    if (fil === filter) {
      return;
    }
    const q = router.query;
    const url = createUrlString({ tfilter: fil, tpage: 1 });
    router.push(`${url}`);
  };
  const loadShirtsSorted = async (data) => {
    if (data.type === sorting) {
      return;
    }
    const q = router.query;
    const url = createUrlString({ tsorting: data.type, tpage: 1 });
    await router.push(`${url}`);
    setSelectedSort(data);
  };
  return (
    <>
      <Header />
      {/* item card */}
      <section className="flex flex-col border-t md:flex-row">
        <div className="hidden w-64 p-4 border-r md:block">
          <div className="fixed top-auto flex flex-col gap-4 px-10 ">
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold">Filters</h3>
              <div className="">
                <div>
                  {filters.map((x, i) => {
                    return (
                      <div className="form-check" key={i}>
                        <input
                          className="float-left w-4 h-4 mt-1 mr-2 align-top transition duration-200 bg-white bg-center bg-no-repeat bg-contain border border-gray-300 rounded-full appearance-none cursor-pointer form-check-input checked:bg-blue-600 checked:border-blue-600 focus:outline-none"
                          type="radio"
                          name="gender"
                          id={x.name}
                          checked={x.name === filter}
                          onChange={() => loadShirtsfiltered(x.name)}
                        />
                        <label
                          className="inline-block text-sm font-semibold text-gray-800 form-check-label"
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
              <div className="w-40 top-16">
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

        <div className="w-10/12 mx-auto">
          {total > 0 ? (
            <>
              {router.query.search && (
                <div className="my-5 font-light text-gray-700 md:p-3 ">
                  <p>
                    <span className="font-bold text-neutral-900">
                      {router.query.search}
                    </span>{" "}
                    - {total} items{" "}
                    <span className="text-xs ">
                      (Showing page {page} of {Math.ceil(maxPages)})
                    </span>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center w-full gap-1 px-4 py-2 mt-3 text-xs font-medium text-red-600 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto "
                      onClick={() => router.push("/")}
                    >
                      <AiOutlineClose className="text-red-600" />
                      Clear search
                    </button>
                  </p>
                </div>
              )}
              <div className="flex items-center justify-end w-full md:hidden">
                <button
                  type="button"
                  className="flex items-center justify-center w-auto gap-1 px-4 py-2 mt-3 text-xs font-medium text-green-600 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none "
                  onClick={() => setIsOpenSort(true)}
                >
                  <GoSettings className="text-green-600" />
                  Sort / Filters
                </button>
                <Transition.Root show={isOpenSort} as={Fragment}>
                  <Dialog
                    as="div"
                    className="fixed inset-0 z-10 my-auto overflow-y-auto rounded "
                    onClose={setIsOpenSort}
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
                        <div className="inline-block w-full overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg ">
                          <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                            <div className="">
                              <div className="flex flex-col gap-10 mt-3 text-left sm:mt-0 sm:ml-4">
                                {/* content */}
                                <div className="flex flex-col gap-1">
                                  <h3 className="font-semibold">Sort By</h3>
                                  <div className="w-full top-16">
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
                                              className="float-left w-4 h-4 mt-1 mr-2 align-top transition duration-200 bg-white bg-center bg-no-repeat bg-contain border border-gray-300 rounded-full appearance-none cursor-pointer form-check-input checked:bg-blue-600 checked:border-blue-600 focus:outline-none"
                                              type="radio"
                                              name="gender"
                                              id={x.name}
                                              checked={x.name === filter}
                                              onChange={() =>
                                                loadShirtsfiltered(x.name)
                                              }
                                            />
                                            <label
                                              className="inline-block text-sm font-semibold text-gray-800 form-check-label"
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
              <div className="grid justify-center grid-cols-1 gap-10 p-4 mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {shirts.map((x, i) => {
                  return (
                    <Link href={`shirts/${x.productId}`} key={i}>
                      <div
                        key={i}
                        className="flex mx-auto group flex-col  md:flex-col max-w-[192px] hover:shadow-xl hover:shadow-neutral-300/20   transition hover:cursor-pointer"
                      >
                        {/* image */}
                        <div className="relative ">
                          <Image
                            width={192}
                            height={255}
                            src={x.images[0].src}
                          />
                          <div className="absolute w-full px-1 -translate-y-10 group-hover:hidden">
                            <span className="p-2 text-xs rounded-full text-neutral-900 bg-neutral-50">
                              {x.rating.toFixed(1)} ⭐ | {x.ratingCount}
                            </span>
                          </div>
                          <div className="hidden w-full px-1 -translate-y-10 bg-white group-hover:absolute group-hover:flex group-hover:justify-start group-hover:items-center ">
                            {/* <span className="flex items-center justify-center gap-1 ">
                      {x.sizes.split(",").map((x) => (
                        <span className="p-1 text-xs text-gray-500 border-2 border-red-300 rounded-full">
                          {x}
                        </span>
                      ))}
                    </span> */}
                            <span className="p-3 text-xs text-gray-500 rounded-full">
                              sizes: {x.sizes}
                            </span>
                          </div>
                        </div>
                        {/* details */}
                        <div className="flex flex-col gap-1 p-3">
                          <h2 className="font-semibold text-neutral-900">
                            {x.brand}
                          </h2>
                          <h3 className="text-sm text-neutral-500">
                            {x.additionalInfo}
                          </h3>
                          <h4 className="text-sm font-semibold text-neutral-900">
                            {x.price === x.mrp ? (
                              <span>Rs.{x.price}</span>
                            ) : (
                              <div className="flex items-center justify-start gap-1">
                                <span className="">Rs.{x.price}</span>
                                <span className="text-xs font-light line-through">
                                  Rs.{x.mrp}
                                </span>
                                <span className="text-xs font-light text-red-500">
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
              </div>
              <div className="pb-10 mx-auto">
                <ul className="flex flex-wrap items-center justify-center gap-1 mx-auto ">
                  {Array.from(Array(Math.ceil(maxPages)), (e, i) => {
                    {
                      return i + 1 === Math.ceil(page) ? (
                        <button
                          onClick={() => loadPage(i + 1)}
                          key={i}
                          className="flex items-center justify-center w-10 h-10 p-1 text-white transition shadow bg-neutral-800 hover:shadow-xl"
                        >
                          {i + 1}
                        </button>
                      ) : (
                        <button
                          onClick={() => loadPage(i + 1)}
                          key={i}
                          className="flex items-center justify-center w-10 h-10 p-1 transition shadow hover:shadow-xl"
                        >
                          {i + 1}
                        </button>
                      );
                    }
                  })}
                </ul>
              </div>
            </>
          ) : (
            router.query.search && (
              <div className="my-10 font-light text-center text-gray-900 ">
                <div className="flex flex-col items-center justify-center gap-10">
                  <p>
                    You searched for{" "}
                    <span className="font-bold text-blue-600">
                      {router.query.search}
                    </span>{" "}
                    {router.query.filter && (
                      <>
                        with filter{" "}
                        <span className="text-blue-600 ">
                          {router.query.filter}
                        </span>
                      </>
                    )}
                  </p>
                  <Image src="/hanger.png" width={228 * 1} height={61 * 1} />
                  <p className="text-4xl ">We couldn't find any matches!</p>
                  <p className="text-sm text-gray-600">
                    Please check the spelling or try searching something else
                  </p>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center w-full gap-1 px-4 py-2 mt-3 text-xs font-medium text-blue-600 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto "
                    onClick={() => router.push("")}
                  >
                    <AiOutlineHome className="text-blue-600" />
                    Back to Home
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </section>
    </>
  );
}
