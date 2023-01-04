import type { NextPageWithLayout } from "@/pages/_app";
import { useCartStore } from "@/stores/cart";
import type { Product } from "@/types/globals";
import { getProducts } from "@/utils/queryFns";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import type { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";

// components imports
import Cart from "@/components/Cart";
import DefaultLayout from "@/components/layouts/DefaultLayout";

type CheckoutProps = {
  products: Product[];
};

const Checkout: NextPageWithLayout<CheckoutProps> = (props) => {
  const { status: authStatus } = useSession();

  // tanstack/react-query
  const productsQuery = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts,
    initialData: props.products,
  });

  //  zustand
  const cartStore = useCartStore((state) => ({
    products: state.products,
  }));

  return (
    <>
      <Head>
        <title>Checkout | Amzn Store</title>
      </Head>
      <main className="min-h-screen bg-bg-gray pt-48 pb-14 md:pt-40 lg:pt-36">
        {/* {authStatus === "loading" ? (
          <div className="text-center text-base text-title md:text-lg">
            Loading...
          </div>
        ) : authStatus === "authenticated" ? (
          <Cart products={productsQuery.data} status={productsQuery.status} />
        ) : (
          <Cart products={cartStore.products} />
        )} */}
        <Cart products={cartStore.products} />
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
