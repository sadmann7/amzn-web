import type { Product } from "@/types/globals";
import { formatCurrency } from "@/utils/format";
import Image from "next/image";

// components imports
import Button from "./Button";

// icons imports
import { StarIcon } from "@heroicons/react/20/solid";

type ProductListProps = {
  products: Product[];
  status: "error" | "success";
};

const ProductList = ({ products, status }: ProductListProps) => {
  return (
    <section
      aria-label="product list"
      className="mx-auto max-w-screen-2xl px-2 sm:w-[95vw]"
    >
      <h2 className="sr-only">Product list</h2>
      {status === "error" ? (
        <div className="text-center text-base text-title md:text-lg">
          Error in fetching products
        </div>
      ) : (
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="flex flex-col gap-3">
              <Image
                src={product.image}
                alt={product.title}
                width={192}
                height={192}
                className="mx-auto h-48 w-48 object-cover"
                loading="lazy"
              />
              <div className="flex items-center gap-1">
                {product.rating.rate
                  ? Array.from(
                      { length: Math.floor(product.rating.rate) },
                      (_, i) => (
                        <StarIcon
                          key={i}
                          className="aspect-square w-4 text-primary"
                        />
                      )
                    )
                  : null}
              </div>
              <h2 className="text-sm font-medium line-clamp-1 md:text-base">
                {product.title}
              </h2>
              <p className="text-xs font-medium line-clamp-2 md:text-sm">
                {product.description}
              </p>
              {product.price ? (
                <p className="text-sm font-medium md:text-base">
                  {formatCurrency(product.price, "USD")}
                </p>
              ) : null}
              <Button className="w-full bg-orange-300 font-bold text-title transition-colors hover:bg-primary active:bg-orange-300">
                Add to Cart
              </Button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductList;
