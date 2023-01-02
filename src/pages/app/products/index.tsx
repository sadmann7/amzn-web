import type { NextPageWithLayout } from "@/pages/_app";
import type { Product } from "@/types/globals";
import { getProducts } from "@/utils/queryFns";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import type { GetServerSideProps } from "next";
import Head from "next/head";

// components imports
import DefaultLayout from "@/components/layouts/DefaultLayout";
import ProductList from "@/components/ProductList";

type AppProps = {
  products: Product[];
};

const Products: NextPageWithLayout<AppProps> = (props) => {
  // tanstack/react-query
  const { data: products, status } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    initialData: props.products,
  });

  return (
    <>
      <Head>
        <title>Products | Amzn Store</title>
      </Head>
      <main className="bg-bg-gray pt-48 md:pt-40 lg:pt-36">
        <div className="mx-auto min-h-screen w-[95vw] max-w-screen-2xl">
          <ProductList products={products} status={status} />
        </div>
      </main>
    </>
  );
};

export default Products;

Products.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;

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
