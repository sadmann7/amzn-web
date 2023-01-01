import Head from "next/head";
import type { NextPageWithLayout } from "../_app";

// components imports
import DefaultLayout from "@/components/layouts/DefaultLayout";
import Hero from "@/components/Hero";

const App: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Amzn Store</title>
      </Head>
      <main className="bg-bg-neutral pt-40 md:pt-32 lg:pt-[6.7rem]">
        <div className="mx-auto min-h-screen w-[95vw] max-w-screen-2xl">
          <Hero />
        </div>
      </main>
    </>
  );
};

export default App;

App.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
