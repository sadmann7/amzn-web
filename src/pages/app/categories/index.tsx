import type { NextPageWithLayout } from "@/pages/_app";
import type { Category } from "@/types/globals";
import { getCategories } from "@/utils/queryFns";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import type { GetServerSideProps } from "next";
import Head from "next/head";

// components imports
import CategoryList from "@/components/CategoryList";
import DefaultLayout from "@/components/layouts/DefaultLayout";

type CategoriesProps = {
  categories: Category[];
};

const Categories: NextPageWithLayout<CategoriesProps> = (props) => {
  // tanstack/react-query
  const { data: categories, status } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    initialData: props.categories,
  });

  return (
    <>
      <Head>
        <title>Categories | Amzn Store</title>
      </Head>
      <main className="min-h-screen bg-bg-gray pt-48 md:pt-40 lg:pt-36">
        <CategoryList categories={categories} status={status} />
      </main>
    </>
  );
};

export default Categories;

Categories.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
