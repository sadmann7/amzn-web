import type { NextPageWithLayout } from "@/pages/_app";
import { trpc } from "@/utils/trpc";
import Head from "next/head";

// components imports
import CategoryList from "@/components/CategoryList";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import Loader from "@/components/Loader";

const Categories: NextPageWithLayout = () => {
  // trpc
  const categoriesQuery = trpc.products.getUniqueCategories.useQuery(
    undefined,
    {
      staleTime: 1000 * 60 * 60 * 24,
    }
  );

  if (categoriesQuery.isLoading) {
    return <Loader />;
  }

  if (categoriesQuery.isError) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="text-xl font-semibold text-title md:text-3xl">
          Error: {categoriesQuery.error.message}
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Categories | Amzn Store</title>
      </Head>
      <main className="min-h-screen bg-bg-gray pt-56 pb-14 md:pt-48">
        <CategoryList categories={categoriesQuery.data} />
      </main>
    </>
  );
};

export default Categories;

Categories.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
