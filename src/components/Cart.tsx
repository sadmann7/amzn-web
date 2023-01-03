import type { Product } from "@/types/globals";
import { formatCurrency } from "@/utils/format";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type CartProps = {
  products: Product[];
  status: "error" | "success";
};

const Cart = ({ products, status }: CartProps) => {
  const totalPrice = products.reduce(
    (acc, product) => acc + (product.price || 0),
    0
  );
  const roundedTotalPrice =
    Math.round((totalPrice + Number.EPSILON) * 100) / 100;

  return (
    <div className="mx-auto w-full bg-white px-5 pt-8 pb-10 sm:w-[95vw]">
      {status === "error" ? (
        <div className="text-center text-base text-title md:text-lg">
          Error in fetching products
        </div>
      ) : products.length <= 0 ? (
        <div className="grid gap-1.5">
          <h1 className="text-2xl text-title md:text-3xl">
            Your Amazon Cart is empty.
          </h1>
          <p className="text-xs font-medium text-text md:text-sm">
            Your Shopping Cart lives to serve. Give it purpose — fill it with
            groceries, clothing, household supplies, electronics, and more.
            Continue shopping on the{" "}
            <Link href={`/`} className="text-blue-700">
              Amzn-web.com homepage
            </Link>
            , learn about {`today's`}
            deals, or visit your Wish List.
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          <div className="flex justify-between gap-4 border-b-2 border-neutral-200 pb-4">
            <div className="grid gap-1.5">
              <h1 className="text-2xl text-title md:text-3xl">Shopping Cart</h1>
              <span className="text-xs font-medium text-blue-700 transition hover:text-primary hover:underline md:text-sm">
                Deselect all items
              </span>
            </div>
            <span className="place-self-end text-xs font-medium text-text md:text-sm">
              Price
            </span>
          </div>
          <div className="grid gap-5 border-b-2 border-neutral-200 pb-4">
            {products.slice(0, 4).map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4" />
                  <Image
                    src={product.image}
                    alt={product.title}
                    className="h-28 w-28 object-contain"
                    width={112}
                    height={112}
                    loading="lazy"
                  />
                  <div className="flex flex-col gap-1">
                    <h1 className="text-sm font-medium text-title md:text-base">
                      {product.title}
                    </h1>
                    <span className="text-xs font-bold capitalize text-text">
                      {product.category}
                    </span>
                    <span className="text-xs font-medium text-blue-700 hover:underline md:text-sm">
                      Remove from cart
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text md:text-sm">
                    {product.price ? formatCurrency(product.price, "USD") : "-"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex">
        <span className="ml-auto">
          Total ({products.length}) : {roundedTotalPrice}
        </span>
      </div>
    </div>
  );
};

export default Cart;
