import Head from "next/head";

const Four0Four = () => {
  return (
    <>
      <Head>
        <title>404: This page could not be found</title>
      </Head>
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 xs:flex-row">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-title sm:text-3xl">404 </h1>
          <span className="text-4xl font-extralight">|</span>
        </div>
        <div className="text-center text-base font-medium text-title sm:text-lg">
          This page could not be found
        </div>
      </div>
    </>
  );
};

export default Four0Four;
