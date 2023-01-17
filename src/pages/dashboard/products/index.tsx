import type { NextPageWithLayout } from "@/pages/_app";
import { trpc } from "@/utils/trpc";
import Head from "next/head";
import Router from "next/router";

// components imports
import Button from "@/components/Button";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import ProductList from "@/components/ProductList";
import ErrorScreen from "@/components/screens/ErrorScreen";
import LoadingScreen from "@/components/screens/LoadingScreen";

const Products: NextPageWithLayout = () => {
  // trpc
  const productsQuery = trpc.products.getProducts.useQuery(undefined, {
    staleTime: 1000 * 60 * 60 * 24,
  });

  if (productsQuery.isLoading) {
    return <LoadingScreen />;
  }

  if (productsQuery.isError) {
    return <ErrorScreen />;
  }

  return (
    <>
      <Head>
        <title>Products | Amzn Store</title>
      </Head>
      <main className="min-h-screen bg-bg-gray pt-48 pb-14 md:pt-36">
        <div className="flex flex-col gap-5 pb-14">
          <div className="mx-auto w-full max-w-screen-2xl px-2 sm:w-[95vw]">
            <Button onClick={() => Router.push("/dashboard/products/add")}>
              Add product
            </Button>
          </div>
          <ProductList products={productsQuery.data} />
        </div>
      </main>
    </>
  );
};

export default Products;

Products.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
