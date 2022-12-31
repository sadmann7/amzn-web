import styles from "@/styles/searchbar.module.css";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import Router from "next/router";
import { Fragment, useEffect, useState } from "react";
import type { Product } from "@/types/globals";

// icons imports
import {
  Bars3BottomLeftIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";

type SearchbarProps<TData> = {
  data: TData[];
  route: string;
};

const Searchbar = <TData extends Product>({
  data,
  route,
}: SearchbarProps<TData>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  // filter data
  const filteredData =
    query === ""
      ? data
      : data.filter((item) =>
          item.title
            ? item.title
                .toLowerCase()
                .replace(/\s+/g, "")
                .includes(query.toLowerCase().replace(/\s+/g, ""))
            : item
        );

  // handle keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [isOpen]);

  return (
    <div role="searchbox" aria-label="searchbox">
      <Combobox
        onChange={(value: TData) => {
          Router.push(`/dashboard/${route}/${value.id}`);
          setIsOpen(false);
        }}
      >
        <div className={styles.inputWrapper}>
          <Combobox.Button className={styles.iconWrapper}>
            <MagnifyingGlassIcon
              className={`${styles.icon} text-neutral-500`}
              aria-hidden="true"
            />
          </Combobox.Button>
          <Combobox.Input
            className={styles.input}
            placeholder={`Search ${route}...`}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options static className={styles.options}>
            {filteredData.length === 0 && query !== "" ? (
              <div className={styles.optionNull}>
                <span className={styles.optionText}>No item found</span>
                <span className={`${styles.iconWrapper}`}>
                  <XMarkIcon className={styles.icon} aria-hidden="true" />
                </span>
              </div>
            ) : (
              filteredData.map((item) => (
                <Combobox.Option
                  key={item.id}
                  className={({ active }) =>
                    `${styles.option} ${
                      active ? "bg-primary-600 text-white" : "text-title"
                    }`
                  }
                  value={item}
                >
                  {({ active }) => (
                    <>
                      <span className={styles.optionText}>{item.title}</span>
                      <span
                        className={`${styles.iconWrapper} ${
                          active ? "text-white" : "text-title"
                        }`}
                      >
                        <Bars3BottomLeftIcon
                          className={styles.icon}
                          aria-hidden="true"
                        />
                      </span>
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </Combobox>
    </div>
  );
};

export default Searchbar;
