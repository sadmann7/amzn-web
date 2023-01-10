import type { NextPageWithLayout } from "@/pages/_app";
import { trpc } from "@/utils/trpc";
import Head from "next/head";

// components imports
import DefaultLayout from "@/components/layouts/DefaultLayout";
import ProductList from "@/components/ProductList";
import Loader from "@/components/Loader";

const Products: NextPageWithLayout = () => {
  // trpc
  const productsQuery = trpc.products.getProducts.useQuery(undefined, {
    staleTime: 1000 * 60 * 60 * 24,
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
      <main className="min-h-screen bg-bg-gray pb-14 pt-48 md:pt-40 lg:pt-36">
        <ProductList products={productsQuery.data} />
      </main>
    </>
  );
};

export default Products;

Products.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
