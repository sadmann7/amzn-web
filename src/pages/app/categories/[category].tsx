import { trpc } from "@/utils/trpc";
import type { PRODUCT_CATEGORY } from "@prisma/client";
import Head from "next/head";
import Router from "next/router";
import type { NextPageWithLayout } from "../../_app";

// components imports
import DefaultLayout from "@/components/layouts/DefaultLayout";
import ProductList from "@/components/ProductList";

const ShowCategory: NextPageWithLayout = () => {
  //  trpc
  const category = Router.query.category as PRODUCT_CATEGORY;
  const productsQuery = trpc.products.getByCategory.useQuery(category, {
    staleTime: Infinity,
  });

  return (
    <>
      <Head>
        <title>Products | Amzn Store</title>
      </Head>
      <main className="min-h-screen bg-bg-gray pt-48 pb-14 md:pt-40 lg:pt-36">
        {productsQuery.isError ? (
          <div className="text-center text-base text-title md:text-lg">
            Error in fetching product
          </div>
        ) : productsQuery.isSuccess ? (
          <ProductList
            products={productsQuery.data}
            status={productsQuery.status}
          />
        ) : null}
      </main>
    </>
  );
};

export default ShowCategory;

ShowCategory.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
