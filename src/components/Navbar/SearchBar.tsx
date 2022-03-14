import React, { useState } from "react";
import { useRouter } from "next/router";
import { RiSearch2Line } from "react-icons/ri";
export default function SearchBar() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const searchFor = async (e, word) => {
    e.preventDefault();
    if (word === "") return;
    await router.push(`/?search=${word}`);
    setSearch("");
  };
  return (
    <form className="flex justify-center gap-1 group">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        aria-label="Filter projects"
        placeholder="Search for shirts ..."
        className="w-full py-2 text-sm leading-6 transition border-2 border-transparent rounded-lg outline-none bg-slate-100 focus:ring-0 focus:outline-none text-slate-900 placeholder:text-slate-500 focus:bg-white focus:border-slate-200 "
      />

      <button
        type="submit"
        onClick={(e) => searchFor(e, search)}
        className="px-2 py-2 text-sm leading-6 transition border-2 rounded-lg text-neutral-900 border-slate-200 focus:outline-none focus:bg-white active:bg-slate-100 focus:border-blue-500"
      >
        <RiSearch2Line className="pointer-events-none animate-wiggle group-focus-within:animate-none text-slate-400 group-focus-within:text-blue-500 " />
      </button>
    </form>
  );
}
