import type { Product } from "@/types/globals";
import { formatCurrency } from "@/utils/format";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

// components imports
import Button from "./Button";

// icons imports
import { StarIcon } from "@heroicons/react/20/solid";

type ProductListProps = {
  products: Product[];
  status: "error" | "success";
};

const renderStars = (rate: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rate) {
      stars.push(
        <StarIcon
          key={i}
          className="h-4 stroke-orange-400 stroke-2 text-primary"
        />
      );
    } else if (i === Math.ceil(rate) && !Number.isInteger(rate)) {
      stars.push(
        <StarIcon
          key={i}
          className="h-4 stroke-orange-400 stroke-2 text-primary"
        />
      );
    } else {
      stars.push(
        <StarIcon
          key={i}
          className="h-4 stroke-orange-400 stroke-2 text-white"
        />
      );
    }
  }
  return stars;
};

const ProductList = ({ products, status }: ProductListProps) => {
  return (
    <section
      aria-label="product list"
      className="mx-auto w-full max-w-screen-2xl px-2 sm:w-[95vw]"
    >
      <h2 className="sr-only">Product list</h2>
      {status === "error" ? (
        <div className="text-center text-base text-title md:text-lg">
          Error in fetching products
        </div>
      ) : (
        <div className="grid grid-flow-row-dense gap-5 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <SlicedProducts products={products} range={{ from: 0, to: 4 }} />
          <Image
            src={`/img/advertisement-one.webp`}
            alt="advertisement one"
            width={1500}
            height={300}
            className="col-span-full"
            loading="lazy"
          />
          <div className="md:col-span-2">
            <SlicedProducts products={products} range={{ from: 4, to: 5 }} />
          </div>
          <SlicedProducts
            products={products}
            range={{ from: 5, to: products.length }}
          />
        </div>
      )}
    </section>
  );
};

export default ProductList;

// SlicedProducts.tsx
type SlicedProductsProps = {
  products: Product[];
  range: {
    from: number;
    to: number;
  };
};

const SlicedProducts = ({ products, range }: SlicedProductsProps) => {
  return (
    <Fragment>
      {products.slice(range.from, range.to).map((product) => (
        <div
          key={product.id}
          className="flex flex-col gap-3 bg-white p-5 shadow transition-opacity hover:bg-opacity-80 active:bg-opacity-100"
        >
          <Link
            href={`/app/products/${product.id}`}
            className="relative mx-auto h-48 w-48"
          >
            <Image
              src={product.image}
              alt={product.title}
              width={192}
              height={192}
              className="absolute h-full w-full object-cover"
              loading="lazy"
            />
          </Link>
          <div className="flex items-center gap-1">
            {product.rating.rate ? renderStars(product.rating.rate) : null}
          </div>
          <Link href={`/app/products/${product.id}`}>
            <h2 className="text-sm font-medium text-title transition-colors line-clamp-1 hover:text-primary md:text-base">
              {product.title}
            </h2>
          </Link>
          <p className="text-xs font-medium text-text line-clamp-2 md:text-sm">
            {product.description}
          </p>
          {product.price ? (
            <p className="text-sm font-medium text-title md:text-base">
              {formatCurrency(product.price, "USD")}
            </p>
          ) : null}
          <Button className="w-full bg-orange-300 text-title transition-colors hover:bg-primary active:bg-orange-300">
            Add to Cart
          </Button>
        </div>
      ))}
    </Fragment>
  );
};
