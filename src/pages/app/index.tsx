import type { Category, Product } from "@/types/globals";
import { getCategories, getProducts } from "@/utils/queryFns";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import type { NextPageWithLayout } from "../_app";

// components imports
import Hero from "@/components/Hero";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import ProductList from "@/components/ProductList";
import CategoryList from "@/components/CategoryList";

type AppProps = {
  products: Product[];
  categories: Category[];
};

const App: NextPageWithLayout<AppProps> = (props) => {
  // tanstack/react-query
  const { data: products, status: productsStatus } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts,
    initialData: props.products,
  });
  const { data: categories, status: categoriesStatus } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
    initialData: props.categories,
  });

  return (
    <>
      <Head>
        <title>Amzn Store</title>
      </Head>
      <main className="min-h-screen bg-bg-gray pt-40 md:pt-32 lg:pt-[6.7rem]">
        <Hero />
        <div className="flex flex-col gap-5 pb-14">
          <CategoryList categories={categories} status={categoriesStatus} />
          <ProductList products={products} status={productsStatus} />
        </div>
      </main>
    </>
  );
};

export default App;

App.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
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
