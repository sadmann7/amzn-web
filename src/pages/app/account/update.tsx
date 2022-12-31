import Head from "next/head";
import type { NextPageWithLayout } from "../../_app";

// components imports
import DefaultLayout from "@/components/layouts/DefaultLayout";

const Update: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Change Name, E-mail | Amzn Store</title>
      </Head>
      <main className="mx-auto min-h-screen w-[95vw] max-w-screen-sm pt-28">
        <div>Update page</div>
      </main>
    </>
  );
};

export default Update;

Update.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
