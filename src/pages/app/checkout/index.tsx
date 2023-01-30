import type { NextPageWithLayout } from "@/pages/_app";
import { useCartStore } from "@/stores/cart";
import Head from "next/head";

// external imports
import Cart from "@/components/Cart";
import DefaultLayout from "@/layouts/DefaultLayout";

const Checkout: NextPageWithLayout = () => {
  //  cart store
  const cartStore = useCartStore((state) => ({
    products: state.products,
  }));

  return (
    <>
      <Head>
        <title>Checkout | Amzn Store</title>
      </Head>
      <main className="min-h-screen bg-bg-gray pt-48 pb-14 md:pt-40 lg:pt-36">
        <Cart products={cartStore.products} />
      </main>
    </>
  );
};

export default Checkout;

Checkout.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
