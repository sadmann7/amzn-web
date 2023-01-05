import type { NextPageWithLayout } from "@/pages/_app";
import { trpc } from "@/utils/trpc";
import Head from "next/head";

// components imports
import DefaultLayout from "@/components/layouts/DefaultLayout";
import ProductList from "@/components/ProductList";

const Products: NextPageWithLayout = () => {
  // trpc
  const productsQuery = trpc.products.get.useQuery(undefined, {
    staleTime: Infinity,
  });

  return (
    <>
      <Head>
        <title>Products | Amzn Store</title>
      </Head>
      <main className="min-h-screen bg-bg-gray pb-14 pt-48 md:pt-40 lg:pt-36">
        {productsQuery.data ? (
          <ProductList
            products={productsQuery.data}
            status={productsQuery.status}
          />
        ) : null}
      </main>
    </>
  );
};

export default Products;

Products.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
