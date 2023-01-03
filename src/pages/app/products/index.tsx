import type { NextPageWithLayout } from "@/pages/_app";
import type { Product } from "@/types/globals";
import { getProducts } from "@/utils/queryFns";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import type { GetServerSideProps } from "next";
import Head from "next/head";

// components imports
import DefaultLayout from "@/components/layouts/DefaultLayout";
import ProductList from "@/components/ProductList";

type ProductsProps = {
  products: Product[];
};

const Products: NextPageWithLayout<ProductsProps> = (props) => {
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
      <main className="min-h-screen bg-bg-gray pb-14 pt-48 md:pt-40 lg:pt-36">
        <ProductList products={products} status={status} />
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
