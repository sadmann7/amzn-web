import { getProducts } from "@/utils/queryFns";
import { trpc } from "@/utils/trpc";
import { Menu, Transition } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import type { Product } from "@/types/globals";

// components imports
import Loader from "../Loader";
import Searchbar from "../Searchbar";

// icons imports
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

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
    name: "New Releases",
    href: "##",
  },
  {
    name: "Categories",
    href: "/app/categories",
  },
  {
    name: "Products",
    href: "/app/products",
  },
  {
    name: "Gift Cards",
    href: "##",
  },
  {
    name: "Returns & Orders",
    href: "##",
  },
  {
    name: "Registry",
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
  // tanstack/react-query
  const { data: products, status } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  if (status === "loading") {
    return <Loader />;
  }

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-layout text-white">
      <div className="mx-auto flex max-w-screen-2xl flex-col items-center justify-between gap-1 px-2 py-1.5 sm:w-[95vw] md:flex-row md:gap-5">
        <div className="flex w-full items-center justify-between gap-0 md:gap-5">
          <Link href={`/app`}>
            <Image
              src={"/img/logo-white.png"}
              alt="amzn logo"
              width={115}
              height={35}
              className="h-auto min-w-[115px] p-3 ring-white transition hover:ring-1"
              priority
            />
          </Link>
          {status === "error" ? (
            <div className="text-xs md:text-sm">Error in fetching products</div>
          ) : (
            <Searchbar
              className="hidden md:block"
              data={products}
              route="products"
            />
          )}
          <div className="flex items-center gap-1 md:gap-2">
            <Dropdown />
            <button className="hidden flex-col gap-0.5 whitespace-nowrap p-2 transition hover:ring-1 hover:ring-white md:flex">
              <span className="text-xs">Retruns</span>
              <span className="text-xs font-medium md:text-sm">& Orders</span>
            </button>
            <button className="relative flex items-center gap-1 rounded-sm px-2 py-3 transition hover:ring-1 hover:ring-white">
              <ShoppingCartIcon
                className="aspect-square w-7"
                aria-hidden="true"
              />
              <span className="absolute top-1 left-[1.15rem] h-5 bg-layout text-base font-medium text-primary md:text-lg">
                0
              </span>
              <span className="text-sm font-medium md:text-base">Cart</span>
            </button>
          </div>
        </div>
        {status === "error" ? (
          <div className="text-xs md:text-sm">Error in fetching products</div>
        ) : (
          <Searchbar className="md:hidden" data={products} route="products" />
        )}
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
    href: "/app/account",
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
  // trpc
  const sessionMutation = trpc.auth.getSession.useQuery();

  return (
    <Menu as="div" className="relative z-10 inline-block text-left">
      <div>
        <Menu.Button className="hidden w-full flex-col justify-center whitespace-nowrap rounded-sm p-2 text-white transition hover:ring-1 hover:ring-white focus:outline-none focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-opacity-75 ui-open:ring-1 ui-open:ring-white md:inline-flex">
          <span className="text-xs">
            Hello,{" "}
            {sessionMutation.data ? sessionMutation.data.user?.name : "sign in"}
          </span>
          <span className="flex items-center gap-0.5">
            <span className="text-xs font-medium md:text-sm">
              Accounts & Lists
            </span>
            <ChevronDownIcon
              className="aspect-square w-5 text-violet-200 transition hover:text-violet-100 ui-open:rotate-180"
              aria-hidden="true"
            />
          </span>
        </Menu.Button>
        <Menu.Button className="flex w-full items-center gap-0.5 whitespace-nowrap rounded-sm px-2 py-4 text-white transition hover:ring-1 hover:ring-white focus:outline-none focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-opacity-75 ui-open:ring-1 ui-open:ring-white md:hidden">
          <span className="text-xs">
            {sessionMutation.data ? sessionMutation.data.user?.name : "Sign in"}
          </span>
          <ChevronDownIcon
            className="aspect-square w-5 text-violet-200 transition hover:text-violet-100 ui-open:rotate-180"
            aria-hidden="true"
          />
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
        <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-sm bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                onClick={() => (sessionMutation.data ? signOut() : signIn())}
              >
                {sessionMutation.data ? "Sign out" : "Sign in"}
              </span>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
