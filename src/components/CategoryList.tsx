import type { Category } from "@/types/globals";
import Link from "next/link";

type CategoryListProps = {
  categories: Category[];
  status: "error" | "success";
};

const CategoryList = ({ categories, status }: CategoryListProps) => {
  return (
    <section
      aria-label="category list"
      className="mx-auto w-full max-w-screen-2xl px-2 sm:w-[95vw]"
    >
      <h2 className="sr-only">Category list</h2>
      {status === "error" ? (
        <div className="text-center text-base text-title md:text-lg">
          Error in fetching categories
        </div>
      ) : (
        <div className="grid gap-5 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link key={category} href={`/app/categories/${category}`}>
              <div className="grid h-64 place-items-center bg-white p-5 text-lg font-bold capitalize text-title shadow-sm transition-opacity hover:bg-opacity-80 active:bg-opacity-100 md:text-xl">
                {category}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default CategoryList;