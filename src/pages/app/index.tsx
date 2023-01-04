import { trpc } from "@/utils/trpc";
import Head from "next/head";
import type { NextPageWithLayout } from "../_app";

// components imports
import CategoryList from "@/components/CategoryList";
import Hero from "@/components/Hero";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import ProductList from "@/components/ProductList";

const App: NextPageWithLayout = () => {
  // trpc
  const productsQuery = trpc.products.get.useQuery(undefined, {
    staleTime: Infinity,
  });
  const categoriesQuery = trpc.products.getUniqueCategories.useQuery(
    undefined,
    {
      staleTime: Infinity,
    }
  );

  return (
    <>
      <Head>
        <title>Amzn Store</title>
      </Head>
      <main className="min-h-screen bg-bg-gray pt-40 md:pt-32 lg:pt-[6.7rem]">
        <Hero />
        <div className="flex flex-col gap-5 pb-14">
          {categoriesQuery.isSuccess ? (
            <CategoryList
              categories={categoriesQuery.data}
              status={categoriesQuery.status}
            />
          ) : null}
          {productsQuery.isSuccess ? (
            <ProductList
              products={productsQuery.data}
              status={productsQuery.status}
            />
          ) : null}
        </div>
      </main>
    </>
  );
};

export default App;

App.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
