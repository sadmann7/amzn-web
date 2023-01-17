import Head from "next/head";
import Router from "next/router";
import type { NextPageWithLayout } from "../../_app";

// components imports
import DefaultLayout from "@/components/layouts/DefaultLayout";

const ShowOrder: NextPageWithLayout = () => {
  const orderId = Number(Router.query.orderId);

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

export default ShowOrder;

ShowOrder.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
