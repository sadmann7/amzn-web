import styles from "@/styles/searchbar.module.css";
import type { Product } from "@/types/globals";
import { Combobox, Transition } from "@headlessui/react";
import Router from "next/router";
import { Fragment, useEffect, useState } from "react";

// icons imports
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";

type SearchbarProps<TData> = {
  data: TData[];
  route: string;
} & JSX.IntrinsicElements["div"];

const Searchbar = <TData extends Product>({
  data,
  route,
  className,
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
    <Combobox
      aria-label="combobox"
      as="div"
      className={`relative w-full max-w-5xl ${className}`}
      onChange={(value: TData) => {
        Router.push(`/dashboard/${route}/${value.id}`);
        setIsOpen(false);
      }}
    >
      <div className={styles.inputWrapper}>
        <Combobox.Input
          className={styles.input}
          placeholder={`Search ${route}...`}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Combobox.Button className={styles.inputButton}>
          <MagnifyingGlassIcon
            className="aspect-square w-6 stroke-2 text-title"
            aria-hidden="true"
          />
        </Combobox.Button>
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
              <span>No item found</span>
            </div>
          ) : (
            filteredData.map((item) => (
              <Combobox.Option
                key={item.id}
                className={styles.option}
                value={item}
              >
                <>
                  <span>{item.title}</span>
                </>
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </Transition>
    </Combobox>
  );
};

export default Searchbar;
