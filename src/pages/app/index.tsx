import type { Product } from "@/types/globals";
import { getProducts } from "@/utils/queryFns";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import type { NextPageWithLayout } from "../_app";

// components imports
import Hero from "@/components/Hero";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import ProductList from "@/components/ProductList";

type AppProps = {
  products: Product[];
};

const App: NextPageWithLayout<AppProps> = (props) => {
  const { data: products, status } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    initialData: props.products,
  });

  return (
    <>
      <Head>
        <title>Amzn Store</title>
      </Head>
      <main className="bg-bg-gray pt-40 md:pt-32 lg:pt-[6.7rem]">
        <div className="mx-auto min-h-screen w-[95vw] max-w-screen-2xl">
          <Hero />
          <ProductList products={products} status={status} />
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
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
