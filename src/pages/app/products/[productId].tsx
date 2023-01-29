import { useCartStore } from "@/stores/cart";
import { formatCurrency, truncateText } from "@/utils/format";
import { trpc } from "@/utils/trpc";
import type { Product } from "@prisma/client";
import Head from "next/head";
import Image from "next/image";
import Router from "next/router";
import { toast } from "react-toastify";
import type { NextPageWithLayout } from "../../_app";

// external imports
import Button from "@/components/Button";
import DefaultLayout from "@/layouts/DefaultLayout";
import ErrorScreen from "@/screens/ErrorScreen";
import LoadingScreen from "@/screens/LoadingScreen";

const ShowProduct: NextPageWithLayout = () => {
  const productId = Router.query.productId as string;

  // get product query
  const productQuery = trpc.products.getProduct.useQuery(productId);

  // cart store
  const cartStore = useCartStore((state) => ({
    addProduct: state.addProduct,
  }));

  if (productQuery.isLoading) {
    return <LoadingScreen />;
  }

  if (productQuery.isError || !productQuery.data) {
    return <ErrorScreen />;
  }

  return (
    <>
      <Head>
        <title>{productQuery.data.name ?? "Product"} | Amzn Store</title>
      </Head>
      <main className="min-h-screen pt-48 pb-14 md:pt-40 lg:pt-36">
        <div className="mx-auto w-full max-w-screen-2xl px-4 sm:w-[95vw]">
          <div className="mx-auto flex w-full flex-col items-center gap-5 md:w-1/2">
            <Image
              src={productQuery.data.image}
              alt={productQuery.data.name}
              width={224}
              height={224}
              loading="lazy"
              className="h-56 w-56 object-contain"
            />
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-center text-xl font-semibold md:text-3xl">
                {productQuery.data.name}
              </h1>
              <p className="text-center text-sm text-lowkey md:text-base">
                {productQuery.data.description}
              </p>
              <p className="text-xl font-semibold md:text-2xl">
                {formatCurrency(productQuery.data.price, "USD")}
              </p>
              <Button
                aria-label="add product to cart"
                className="mt-1.5 bg-orange-300 px-5 text-title transition-colors hover:bg-primary active:bg-orange-300"
                onClick={() => {
                  cartStore.addProduct(productQuery.data as Product);
                  toast.success(
                    `${truncateText(
                      productQuery.data?.name as string,
                      16
                    )} added to cart`
                  );
                }}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ShowProduct;

ShowProduct.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
