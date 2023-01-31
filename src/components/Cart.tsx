import { useCartStore } from "@/stores/cart";
import { formatCurrency, formatEnum } from "@/utils/format";
import { trpc } from "@/utils/trpc";
import type { Product } from "@prisma/client";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

const Cart = ({ products }: { products: Product[] }) => {
  const { status } = useSession();

  const totalPrice = products.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );
  const totalQuantity = products.reduce(
    (acc, product) => acc + product.quantity,
    0
  );

  // cart store
  const cartStore = useCartStore((state) => ({
    removeProducts: state.removeProducts,
  }));

  // add order mutation
  const addOrderMutation = trpc.orders.create.useMutation({
    onSuccess: async () => {
      cartStore.removeProducts(products.map((product) => product.id));
      toast.success("Products added to order!");
    },
    onError: async (err) => {
      toast.error(err.message);
    },
  });

  return (
    <div className="mx-auto w-full px-4 sm:w-[95vw]">
      {products.length <= 0 ? (
        <div className="grid gap-1.5 bg-white px-5 pt-8 pb-10">
          <h1 className="text-2xl text-title md:text-3xl">
            Your Amzn Cart is empty.
          </h1>
          <p className="text-xs font-medium text-text md:text-sm">
            Your Shopping Cart lives to serve. Give it purpose — fill it with
            groceries, clothing, household supplies, electronics, and more.
            Continue shopping on the{" "}
            <Link href={`/`} className="text-link hover:underline">
              Amzn-web.com homepage
            </Link>
            , learn about {`today's`}
            deals, or visit your Wish List.
          </p>
        </div>
      ) : (
        <div className="flex flex-col-reverse justify-between md:flex-row md:gap-5">
          <div className="grid flex-[0.8] gap-5 bg-white px-5 pb-10 pt-5 md:pt-8">
            <div className="flex justify-between gap-4 md:border-b-2 md:border-neutral-200 md:pb-4">
              <span>
                <h1 className="text-xl text-title md:text-3xl">
                  Shopping Cart
                </h1>
                <button
                  className="mt-1 text-xs font-medium text-link transition-opacity hover:text-opacity-80 active:text-opacity-90 md:text-sm"
                  onClick={() => {
                    cartStore.removeProducts(
                      products.map((product) => product.id)
                    );
                    toast.success("Cart cleared!");
                  }}
                >
                  Remove all products
                </button>
              </span>
              <span className="hidden place-self-end text-xs font-medium text-text md:block md:text-sm">
                Price
              </span>
            </div>
            <div className="grid gap-5">
              {products.map((product) => (
                <ProductCard product={product} key={crypto.randomUUID()} />
              ))}
            </div>
            <div className="ml-auto hidden text-base font-semibold md:block">
              Subtotal ({totalQuantity} {totalQuantity > 1 ? "items" : "item"})
              :{" "}
              <span className="font-bold">
                {formatCurrency(totalPrice, "USD")}
              </span>
            </div>
          </div>
          <div className="flex flex-[0.2] flex-col gap-4 bg-white px-5 pt-5 md:h-40 md:pb-10 2xl:h-32">
            <div className="text-base font-semibold md:text-lg">
              Subtotal ({totalQuantity} {totalQuantity > 1 ? "items" : "item"})
              :{" "}
              <span className="font-bold">
                {formatCurrency(totalPrice, "USD")}
              </span>
            </div>
            <button
              className="w-full rounded-md bg-yellow-300 py-2.5 text-xs font-medium text-title transition-colors hover:bg-yellow-400 active:bg-yellow-300 disabled:cursor-not-allowed md:whitespace-nowrap md:px-5 md:py-2 md:text-sm"
              onClick={() => {
                status === "unauthenticated"
                  ? signIn()
                  : addOrderMutation.mutateAsync(
                      products.map((product) => ({
                        productId: product.id,
                        productQuantity: product.quantity,
                      }))
                    );
              }}
              disabled={addOrderMutation.isLoading}
            >
              {addOrderMutation.isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="mr-3 inline h-4 w-4 animate-spin text-white"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                  Adding to order...
                </span>
              ) : (
                "Proceed to checkout"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

const ProductCard = ({ product }: { product: Product }) => {
  const [selectedQuantity, setSelectedQuantity] = useState(product.quantity);

  // zustand
  const cartStore = useCartStore((state) => ({
    removeProduct: state.removeProduct,
    setQuantity: state.setQuantity,
  }));

  return (
    <div className="flex flex-col gap-4 border-b-2 pb-4 md:flex-row md:items-center md:justify-between md:border-neutral-200">
      <div className="flex gap-2">
        <Image
          src={product.image}
          alt={product.name}
          className="h-28 min-w-[112px] object-contain"
          width={112}
          height={112}
          loading="lazy"
        />
        <div className="flex flex-col gap-1.5">
          <span className="text-base font-medium text-title line-clamp-2 md:text-lg">
            {product.name}
          </span>
          <span className="block text-base font-bold text-text md:hidden">
            {product.price ? formatCurrency(product.price, "USD") : "-"}
          </span>
          <span className="text-xs font-bold capitalize text-text">
            {formatEnum(product.category)}
          </span>
          <div className="mt-2.5 flex flex-wrap gap-5 divide-x-2 divide-neutral-200">
            <select
              name="quantity"
              id="product-quantity"
              className="cursor-pointer rounded-sm py-1 text-xs font-medium text-title transition-colors hover:bg-neutral-100 active:bg-white md:text-sm"
              value={selectedQuantity}
              onChange={(e) => {
                setSelectedQuantity(Number(e.target.value));
                cartStore.setQuantity(product.id, Number(e.target.value));
              }}
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((quantity) => (
                <option key={quantity} value={quantity} className="font-medium">
                  {quantity}
                </option>
              ))}
            </select>
            <button
              aria-label="delete product"
              className="w-fit px-4 text-xs font-medium text-link hover:underline md:text-sm"
              onClick={() => cartStore.removeProduct(product.id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <span className="hidden self-start text-xs font-medium text-text md:block md:text-sm">
        {product.price ? formatCurrency(product.price, "USD") : "-"}
      </span>
    </div>
  );
};
