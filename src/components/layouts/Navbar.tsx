import { env } from "@/env/client.mjs";
import type { Product } from "@/types/globals";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";

// components imports
import Searchbar from "../Searchbar";

// icons imports
import { ChevronDownIcon, ShoppingCartIcon } from "@heroicons/react/20/solid";

const bottomLinks = [
  {
    name: "Today's Deals",
    href: "##",
  },
  {
    name: "Best Sellers",
    href: "##",
  },
  {
    name: "Livestreams",
    href: "##",
  },
  {
    name: "New Releases",
    href: "##",
  },
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Gift Cards",
    href: "##",
  },
  {
    name: "Registry",
    href: "##",
  },
  {
    name: "Buy Again",
    href: "##",
  },
  {
    name: "Customer Service",
    href: "##",
  },
  {
    name: "Browsing History",
    href: "##",
  },
  {
    name: "Sell",
    href: "##",
  },
];

const Navbar = () => {
  const [products, setProducts] = useState<Product[]>();
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(env.NEXT_PUBLIC_PRODUCTS_GET);
      const data = await res.json();
      if (!data) return;
      setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-layout text-white">
      <div className="mx-auto flex w-[95vw] max-w-screen-2xl flex-col items-center justify-between gap-1 py-1.5 md:flex-row md:gap-5">
        <div className="flex w-full items-center justify-between gap-5">
          <Link href={`/`}>
            <Image
              src={"/img/logo-white.png"}
              alt="amzn logo"
              width={115}
              height={35}
              className="h-auto min-w-[100px] p-2 ring-white transition hover:ring-1"
            />
          </Link>
          {products ? (
            <Searchbar
              className="hidden md:block"
              data={products}
              route="products"
            />
          ) : null}
          <div className="flex items-center justify-between gap-1">
            <Dropdown />
            <button className="flex items-center gap-1 rounded-sm p-2 transition hover:ring-1 hover:ring-white">
              <ShoppingCartIcon
                className="aspect-square w-7"
                aria-hidden="true"
              />
              <span className="text-sm font-medium md:text-base">Cart</span>
            </button>
          </div>
        </div>
        {products ? (
          <Searchbar className="md:hidden" data={products} route="products" />
        ) : null}
      </div>
      <div className="w-full bg-layout-light">
        <div className="mx-auto flex w-[95vw] max-w-screen-2xl items-center justify-between gap-4 overflow-x-auto whitespace-nowrap py-2 px-1 md:justify-start ">
          {bottomLinks.map((link) => (
            <Link
              href={link.href}
              key={link.name}
              className="px-1 pt-0.5 pb-1 text-xs font-medium transition hover:ring-1 hover:ring-white md:text-sm"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

// Dropdown
const dropLinks = [
  {
    name: "Account",
    href: "##",
  },
  {
    name: "Create a List",
    href: "##",
  },
  {
    name: "Lists",
    href: "##",
  },

  {
    name: "Watchlist",
    href: "##",
  },
];

const Dropdown = () => {
  const { data: session } = useSession();

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full flex-col justify-center whitespace-nowrap rounded-sm p-2 text-white transition hover:ring-1 hover:ring-white focus:outline-none focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-opacity-75 ui-open:ring-1 ui-open:ring-white">
          <span className="text-xs">
            Hello, {session ? session.user?.name : "sign in"}
          </span>
          <span className="flex items-center gap-0.5">
            <span className="text-xs font-medium md:text-sm">
              Accounts & Lists
            </span>
            <ChevronDownIcon
              className="aspect-square w-5 stroke-2 text-violet-200 transition hover:text-violet-100 ui-open:rotate-180"
              aria-hidden="true"
            />
          </span>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="flex flex-col gap-2 px-5 py-4">
            {dropLinks.map((link) => (
              <Menu.Item key={link.name}>
                <Link
                  href={link.href}
                  className="w-full text-xs text-title transition ui-active:text-primary ui-active:underline md:text-sm"
                >
                  {link.name}
                </Link>
              </Menu.Item>
            ))}
            <Menu.Item>
              <span
                aria-label="Sign out"
                className="w-full cursor-pointer text-xs text-title transition ui-active:text-primary ui-active:underline md:text-sm"
                onClick={() => (session ? signOut() : signIn())}
              >
                {session ? "Sign out" : "Sign in"}
              </span>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
