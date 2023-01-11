import type { NextPageWithLayout } from "@/pages/_app";
import Head from "next/head";

// components imports
import DefaultLayout from "@/components/layouts/DefaultLayout";

const Orders: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Orders | Amzn Store</title>
      </Head>
      <main className="min-h-screen bg-bg-gray pt-48 pb-14 md:pt-36">
        <div className="flex flex-col gap-5 pb-14">Orders</div>
      </main>
    </>
  );
};

export default Orders;

Orders.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
