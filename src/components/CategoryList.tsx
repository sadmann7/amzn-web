import { formatEnum } from "@/utils/format";
import type { PRODUCT_CATEGORY } from "@prisma/client";
import Link from "next/link";

const CategoryList = ({ categories }: { categories: PRODUCT_CATEGORY[] }) => {
  return (
    <section
      aria-label="category list"
      className="mx-auto w-full max-w-screen-2xl px-4 sm:w-[95vw]"
    >
      <h2 className="sr-only">Category list</h2>
      <div className="grid grid-flow-row-dense gap-5 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => (
          <Link key={category} href={`/app/categories/${category}`}>
            <div className="grid h-48 place-items-center bg-white p-5 text-lg font-bold text-title shadow transition-opacity hover:bg-opacity-60 active:bg-opacity-90 md:h-64 md:text-xl">
              {formatEnum(category)}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryList;
