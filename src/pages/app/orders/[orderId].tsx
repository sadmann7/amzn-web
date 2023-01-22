import Head from "next/head";
import Router from "next/router";
import type { NextPageWithLayout } from "../../_app";

// imports: components
import DefaultLayout from "@/components/layouts/DefaultLayout";

const ShowOrder: NextPageWithLayout = () => {
  const orderId = Number(Router.query.orderId);

  return (
    <>
      <Head>
        <title>Update Order | Amzn Store</title>
      </Head>
      <main className="mx-auto min-h-screen w-full max-w-screen-sm px-4 pt-52 pb-14 sm:w-[95vw] md:pt-40">
        <div>Order: {orderId}</div>
      </main>
    </>
  );
};

export default ShowOrder;

ShowOrder.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
