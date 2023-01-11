import Head from "next/head";
import Router from "next/router";
import type { NextPageWithLayout } from "../../_app";

// components imports
import DefaultLayout from "@/components/layouts/DefaultLayout";

const UpdateOrder: NextPageWithLayout = () => {
  const orderId = Router.query.orderId as string;

  return (
    <>
      <Head>
        <title>Update Order | Amzn Store</title>
      </Head>
      <main className="mx-auto min-h-screen w-[95vw] max-w-screen-sm px-2 pt-52 pb-14 md:pt-40">
        <div>Order: {orderId}</div>
      </main>
    </>
  );
};

export default UpdateOrder;

UpdateOrder.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
