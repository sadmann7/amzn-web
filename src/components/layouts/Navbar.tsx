import { env } from "@/env/client.mjs";
import styles from "@/styles/layouts/navbar.module.css";
import type { Product } from "@/types/globals";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";

// components imports
import Searchbar from "../Searchbar";

// icons imports
import { ChevronDownIcon } from "@heroicons/react/20/solid";

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
    <nav className="fixed top-0 left-0 w-full bg-layout py-4 text-white">
      <div className="mx-auto flex w-[89vw] max-w-screen-2xl items-center justify-between gap-5">
        <div className={styles.lgoo}>
          <Link href={`/`}>amazon</Link>
        </div>
        <div className="flex items-center justify-between gap-5">
          {products ? <Searchbar data={products} route="products" /> : null}
          <Dropdown />
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
        <Menu.Button className="inline-flex w-full flex-col justify-center rounded-sm px-4 py-2 text-white transition hover:ring-1 hover:ring-white focus:outline-none focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-opacity-75 ui-open:ring-1 ui-open:ring-white">
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
                  className="w-full text-xs text-title transition ui-active:text-primary ui-active:underline sm:text-sm"
                >
                  {link.name}
                </Link>
              </Menu.Item>
            ))}
            <Menu.Item>
              <span
                aria-label="Sign out"
                className="w-full cursor-pointer text-xs text-title transition ui-active:text-primary ui-active:underline sm:text-sm"
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
