import { trpc } from "@/utils/trpc";
import type { PRODUCT_CATEGORY } from "@prisma/client";
import Head from "next/head";
import Router from "next/router";
import type { NextPageWithLayout } from "../../_app";

// components imports
import DefaultLayout from "@/layouts/DefaultLayout";
import ProductList from "@/components/ProductList";
import ErrorScreen from "@/screens/ErrorScreen";
import LoadingScreen from "@/screens/LoadingScreen";

const ShowCategory: NextPageWithLayout = () => {
  //  trpc
  const category = Router.query.category as PRODUCT_CATEGORY;
  const productsQuery = trpc.products.getProductsByCategory.useQuery(category, {
    staleTime: Infinity,
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
      <main className="min-h-screen bg-bg-gray pt-48 pb-14 md:pt-40 lg:pt-36">
        <ProductList products={productsQuery.data} />
      </main>
    </>
  );
};

export default ShowCategory;

ShowCategory.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
