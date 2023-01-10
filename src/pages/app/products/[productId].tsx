import { trpc } from "@/utils/trpc";
import Head from "next/head";
import Router from "next/router";
import type { NextPageWithLayout } from "../../_app";

// components imports
import DefaultLayout from "@/components/layouts/DefaultLayout";
import Loader from "@/components/Loader";

const ShowProduct: NextPageWithLayout = () => {
  // trpc
  const productId = Number(Router.query.productId);
  const productQuery = trpc.products.getProduct.useQuery(productId);

  if (productQuery.isLoading) {
    return <Loader />;
  }

  if (!productQuery.data)
    return (
      <div className="mx-auto w-full max-w-screen-2xl px-2 sm:w-[95vw]">
        <div className="text-center text-base text-title md:text-lg">
          Product not found
        </div>
      </div>
    );

  return (
    <>
      <Head>
        <title>{productQuery.data.title ?? "Product"} | Amzn Store</title>
      </Head>
      <main className="min-h-screen pt-48 md:pt-40 lg:pt-36">
        <div className="mx-auto w-full max-w-screen-2xl px-2 sm:w-[95vw]">
          {productQuery.isError ? (
            <div className="text-center text-base text-title md:text-lg">
              Error in fetching product
            </div>
          ) : (
            <div className="text-center text-base text-title md:text-lg">
              {productQuery.data.title}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default ShowProduct;

ShowProduct.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
