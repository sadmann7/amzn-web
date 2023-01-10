import { trpc } from "@/utils/trpc";
import type { PRODUCT_CATEGORY } from "@prisma/client";
import Head from "next/head";
import Router from "next/router";
import type { NextPageWithLayout } from "../../_app";

// components imports
import DefaultLayout from "@/components/layouts/DefaultLayout";
import ProductList from "@/components/ProductList";
import Loader from "@/components/Loader";

const ShowCategory: NextPageWithLayout = () => {
  //  trpc
  const category = Router.query.category as PRODUCT_CATEGORY;
  const productsQuery = trpc.products.getProductsByCategory.useQuery(category, {
    staleTime: Infinity,
  });

  if (productsQuery.isLoading) {
    return <Loader />;
  }

  if (productsQuery.isError) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="text-xl font-semibold text-title md:text-3xl">
          Error: {productsQuery.error.message}
        </div>
      </div>
    );
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
