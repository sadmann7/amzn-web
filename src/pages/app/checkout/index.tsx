import type { NextPageWithLayout } from "@/pages/_app";
import type { Product } from "@/types/globals";
import { getProducts } from "@/utils/queryFns";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import type { GetServerSideProps } from "next";
import Head from "next/head";

// components imports
import Cart from "@/components/Cart";
import DefaultLayout from "@/components/layouts/DefaultLayout";

type CheckoutProps = {
  products: Product[];
};

const Checkout: NextPageWithLayout<CheckoutProps> = (props) => {
  // tanstack/react-query
  const { data: products, status } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts,
    initialData: props.products,
  });

  return (
    <>
      <Head>
        <title>Checkout | Amzn Store</title>
      </Head>
      <main className="min-h-screen bg-bg-gray pt-48 pb-14 md:pt-40 lg:pt-36">
        <Cart products={products} status={status} />
      </main>
    </>
  );
};

export default Checkout;

Checkout.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;

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
