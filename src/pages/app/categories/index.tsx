import type { NextPageWithLayout } from "@/pages/_app";
import { trpc } from "@/utils/trpc";
import Head from "next/head";

// external imports
import CategoryList from "@/components/CategoryList";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import ErrorScreen from "@/components/screens/ErrorScreen";
import LoadingScreen from "@/components/screens/LoadingScreen";

const Categories: NextPageWithLayout = () => {
  // get categories query
  const categoriesQuery = trpc.products.getCategories.useQuery(undefined, {
    staleTime: 1000 * 60 * 60 * 24,
  });

  if (categoriesQuery.isLoading) {
    return <LoadingScreen />;
  }

  if (categoriesQuery.isError) {
    return <ErrorScreen error={categoriesQuery.error} />;
  }

  return (
    <>
      <Head>
        <title>Categories | Amzn Store</title>
      </Head>
      <main className="min-h-screen bg-bg-gray pb-14 pt-56 md:pt-48">
        <CategoryList categories={categoriesQuery.data} />
      </main>
    </>
  );
};

export default Categories;

Categories.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
