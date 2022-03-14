import Image from "next/image";
import Link from "next/link";
import SearchBar from "./SearchBar";
import WishList from "./WishList";
import Cart from "./Cart";
import { RiUserLine } from "react-icons/ri";

function Header() {
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
              className="flex items-center justify-center"
            >
              <Image src="/logo.svg" width={168} height={35} />
            </a>
          </Link>
        </div>
        <div className="flex flex-col items-center justify-around gap-5 py-3 sm:flex-row md:py-4">
          <SearchBar />
          <div className="flex gap-1">
            <button
              aria-label="profile"
              disabled
              className="flex flex-col items-center justify-center mx-2 text-xs font-medium transition text-neutral-900 hover:text-red-500"
            >
              <RiUserLine />
              Profile
            </button>
            <WishList />
            <Cart />
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
