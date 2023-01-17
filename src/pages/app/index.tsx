import { trpc } from "@/utils/trpc";
import Head from "next/head";
import type { NextPageWithLayout } from "../_app";

// imports: components
import CategoryList from "@/components/CategoryList";
import Hero from "@/components/Hero";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import Loader from "@/components/Loader";
import ProductList from "@/components/ProductList";

const App: NextPageWithLayout = () => {
  // trpc
  const productsQuery = trpc.products.getProducts.useQuery(undefined, {
    staleTime: 1000 * 60 * 60 * 24,
  });
  const categoriesQuery = trpc.products.getUniqueCategories.useQuery(
    undefined,
    {
      staleTime: 1000 * 60 * 60 * 24,
    }
  );

  if (categoriesQuery.isLoading || productsQuery.isLoading) {
    return <Loader />;
  }

  if (categoriesQuery.isError || productsQuery.isError) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="text-xl font-semibold text-title md:text-3xl">
          Error:{" "}
          {categoriesQuery.error?.message || productsQuery.error?.message}
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Amzn Store</title>
      </Head>
      <main className="min-h-screen bg-bg-gray pt-40 md:pt-24">
        <Hero />
        <div className="flex flex-col gap-5 pb-14">
          <CategoryList categories={categoriesQuery.data} />
          <ProductList products={productsQuery.data} />
        </div>
      </main>
    </>
  );
};

export default App;

App.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
