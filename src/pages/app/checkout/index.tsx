import type { NextPageWithLayout } from "@/pages/_app";
import Head from "next/head";

// components imports
import DefaultLayout from "@/components/layouts/DefaultLayout";

const Checkout: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Checkout | Amzn Store</title>
      </Head>
      <main className="min-h-screen bg-bg-gray pt-48 pb-14 md:pt-40 lg:pt-36">
        Checkout page
      </main>
    </>
  );
};

export default Checkout;

Checkout.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
