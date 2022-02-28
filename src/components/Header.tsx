import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useEffect, useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import {
  RiUserFill,
  RiUserLine,
  RiHeart3Fill,
  RiHeart3Line,
  RiShoppingBasketFill,
  RiShoppingBasketLine,
  RiSearch2Line,
  RiSearch2Fill,
} from "react-icons/ri";
function Header() {
  const router = useRouter();
  const [showBorder, setShowBorder] = useState(false);

  function handleScroll() {
    const position = window.scrollY;
    setShowBorder(position > 40);
  }
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <header className="z-[1000] bg-white shadow sticky top-0 w-full px-5 flex flex-col md:flex-row justify-center items-center md:justify-between  transition duration-300 ease-in-out">
      <nav
        className={
          showBorder
            ? `w-full  flex  flex-col md:flex-row justify-center items-center md:justify-between max-w-[1200px] mx-auto border-b transition-all`
            : `w-full  flex  flex-col md:flex-row justify-center items-center md:justify-between max-w-[1200px] mx-auto transition-all border-b border-neutral-50 `
        }
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
        <div className="flex flex-row items-center justify-around gap-2 py-3 md:py-4">
          <div className="group relative rounded-md ">
            <RiSearch2Line className="animate-wiggle group-focus-within:animate-none absolute left-3 top-1/2 -mt-2.5 text-slate-400 pointer-events-none  group-focus-within:text-blue-500 dark:text-slate-500" />
            <input
              type="text"
              aria-label="Filter projects"
              placeholder="Search for shirts ..."
              className="appearance-none w-8/12 sm:w-full  focus:w-full transition-all text-sm leading-6  border-none bg-slate-100 text-slate-900 placeholder:text-slate-500 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 dark:text-slate-100 dark:placeholder:text-slate-500 dark:ring-0 dark:focus:ring-2"
            />
          </div>
          <div className="flex gap-1">
            <Link href="/profile">
              <a
                aria-label="profile"
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
              </a>
            </Link>
            <Link href="/wishlist">
              <a
                aria-label="wishlist"
                className={
                  router.pathname.split("?")[0] === "/wishlist"
                    ? "text-red-600 hover:text-red-500 "
                    : "  text-neutral-900 hover:text-red-500 " +
                      " flex flex-col items-center justify-center transition font-medium text-xs mx-2"
                }
              >
                {router.pathname.split("?")[0] === "/wishlist" ? (
                  <RiHeart3Fill />
                ) : (
                  <RiHeart3Line />
                )}
                WishList
              </a>
            </Link>
            <Link href="/cart">
              <a
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
                  <span className="absolute -translate-y-2 translate-x-4 top-0 right-0 text-[10px]  text-gray-50 h-4 w-4 flex items-center justify-center rounded-full bg-red-400 p-1">
                    1
                  </span>
                  <span className="sr-only">items in cart, view bag</span>
                </div>
                Cart
              </a>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
