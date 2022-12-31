import Head from "next/head";
import type { NextPageWithLayout } from "../_app";

// components imports
import DefaultLayout from "@/components/layouts/DefaultLayout";

const Dashboard: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Dashboard | Amzn Store</title>
      </Head>
      <main className="mx-auto min-h-screen w-[95vw] max-w-screen-2xl">
        <div>Dashboard page</div>
      </main>
    </>
  );
};

export default Dashboard;

Dashboard.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
