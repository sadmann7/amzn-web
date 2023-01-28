import { trpc } from "@/utils/trpc";
import Head from "next/head";
import Router from "next/router";
import type { NextPageWithLayout } from "../../_app";

// imports: components
import DefaultLayout from "@/layouts/DefaultLayout";
import ErrorScreen from "@/screens/ErrorScreen";
import LoadingScreen from "@/screens/LoadingScreen";

const ShowProduct: NextPageWithLayout = () => {
  // trpc
  const productId = Number(Router.query.productId);
  const productQuery = trpc.products.getProduct.useQuery(productId);

  if (productQuery.isLoading) {
    return <LoadingScreen />;
  }

  if (!productQuery.data) {
    return <ErrorScreen />;
  }

  return (
    <>
      <Head>
        <title>{productQuery.data.title ?? "Product"} | Amzn Store</title>
      </Head>
      <main className="min-h-screen pt-48 md:pt-40 lg:pt-36">
        <div className="mx-auto w-full max-w-screen-2xl px-4 sm:w-[95vw]">
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
