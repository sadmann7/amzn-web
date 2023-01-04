import type { NextPageWithLayout } from "@/pages/_app";
import Head from "next/head";

// components imports
import CategoryList from "@/components/CategoryList";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import { trpc } from "@/utils/trpc";

const Categories: NextPageWithLayout = () => {
  // trpc
  const categoriesQuery = trpc.products.findCategories.useQuery(undefined, {
    staleTime: Infinity,
  });

  return (
    <>
      <Head>
        <title>Categories | Amzn Store</title>
      </Head>
      <main className="min-h-screen bg-bg-gray pt-56 pb-14 md:pt-48">
        {categoriesQuery.isSuccess ? (
          <CategoryList
            categories={categoriesQuery.data}
            status={categoriesQuery.status}
          />
        ) : null}
      </main>
    </>
  );
};

export default Categories;

Categories.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
