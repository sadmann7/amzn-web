import { trpc } from "@/utils/trpc";
import Head from "next/head";
import type { NextPageWithLayout } from "../_app";

// external imports
import CategoryList from "@/components/CategoryList";
import Hero from "@/components/Hero";
import ProductList from "@/components/ProductList";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import ErrorScreen from "@/components/screens/ErrorScreen";
import LoadingScreen from "@/components/screens/LoadingScreen";

const App: NextPageWithLayout = () => {
  // get queries
  const categoriesQuery = trpc.products.getCategories.useQuery(undefined, {
    staleTime: 1000 * 60 * 60 * 24,
  });
  const productsQuery = trpc.products.get.useQuery(undefined, {
    staleTime: 1000 * 60 * 60 * 24,
  });

  if (categoriesQuery.isLoading || productsQuery.isLoading) {
    return <LoadingScreen />;
  }

  if (categoriesQuery.isError) {
    return <ErrorScreen error={categoriesQuery.error} />;
  }

  if (productsQuery.isError) {
    return <ErrorScreen error={productsQuery.error} />;
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
