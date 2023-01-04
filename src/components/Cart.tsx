import { useCartStore } from "@/stores/cart";
import { formatCurrency } from "@/utils/format";
import type { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useForm, type SubmitHandler } from "react-hook-form";

type CartProps = {
  products: Product[];
  status?: "error" | "success";
};

const Cart = ({ products, status }: CartProps) => {
  // total price
  const totalPrice = products.reduce(
    (acc, product) => acc + (product.price || 0),
    0
  );
  const roundedTotalPrice =
    Math.round((totalPrice + Number.EPSILON) * 100) / 100;

  return (
    <div className="mx-auto w-full sm:w-[95vw]">
      {status === "error" ? (
        <div className="px-5 pt-8 pb-10 text-center text-base text-title md:text-lg">
          Error in fetching products
        </div>
      ) : products.length <= 0 ? (
        <div className="grid gap-1.5 bg-white px-5 pt-8 pb-10">
          <h1 className="text-2xl text-title md:text-3xl">
            Your Amazon Cart is empty.
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
              <h1 className="text-xl text-title md:text-3xl">Shopping Cart</h1>
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
              Subtotal ({products.length} item) :{" "}
              <span className="font-bold">
                {formatCurrency(roundedTotalPrice, "USD")}
              </span>
            </div>
          </div>
          <div className="flex flex-[0.2] flex-col gap-3 bg-white px-5 pt-5 md:h-40 md:pb-10 lg:h-36">
            <div className="text-base font-semibold md:text-lg">
              Subtotal ({products.length} item) :{" "}
              <span className="font-bold">
                {formatCurrency(roundedTotalPrice, "USD")}
              </span>
            </div>
            <button className="w-full rounded-md bg-yellow-300 py-2.5 text-xs font-medium text-title transition-colors hover:bg-yellow-400 active:bg-yellow-300 md:px-2 md:py-2 md:text-sm">
              Proceed to checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

type Inputs = {
  quantity: number;
};

const ProductCard = ({ product }: { product: Product }) => {
  // zustand
  const cartStore = useCartStore((state) => ({
    removeProduct: state.removeById,
  }));

  // react-hook-form
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col gap-4 border-b-2 pb-4 md:flex-row md:items-center md:justify-between md:border-neutral-200">
      <div className="flex gap-2">
        <Image
          src={product.image}
          alt={product.title}
          className="h-28 min-w-[112px] object-contain"
          width={112}
          height={112}
          loading="lazy"
        />
        <div className="flex flex-col gap-1.5">
          <span className="text-base font-medium text-title line-clamp-2 md:text-lg">
            {product.title}
          </span>
          <span className="block text-base font-bold text-text md:hidden">
            {product.price ? formatCurrency(product.price, "USD") : "-"}
          </span>
          <span className="text-xs font-bold capitalize text-text">
            {product.category}
          </span>
          <div className="mt-2.5 flex flex-wrap gap-5 divide-x-2 divide-neutral-200">
            <form onSubmit={handleSubmit(onSubmit)}>
              <select
                id="product-quantity"
                className="cursor-pointer rounded-sm py-1 text-xs font-medium text-title transition-colors hover:bg-neutral-100 active:bg-white md:text-sm"
                {...register("quantity", {
                  required: true,
                  valueAsNumber: true,
                })}
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((quantity) => (
                  <option
                    key={quantity}
                    value={quantity}
                    className="font-medium"
                  >
                    {quantity}
                  </option>
                ))}
              </select>
            </form>
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
