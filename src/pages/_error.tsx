import Button from "@/components/Button";
import Head from "next/head";
import Router from "next/router";
import { useEffect, useState } from "react";
import type { NextPageWithLayout } from "./_app";

const Four0Four: NextPageWithLayout = ({ statusCode }) => {
  const [statusMesasge, setStatusMesasge] = useState("");

  useEffect(() => {
    switch (statusCode) {
      case 404:
        setStatusMesasge("Page not found");
        break;
      case 500:
        setStatusMesasge("Internal server error");
        break;
      case 401:
        setStatusMesasge("Unauthorized");
        break;
      case 403:
        setStatusMesasge("Forbidden");
        break;
      default:
        setStatusMesasge("An error occurred on client");
        break;
    }
  }, [statusCode]);

  return (
    <>
      <Head>
        <title>Error | Amzn Store</title>
        <meta
          name="description"
          content="The page you are looking for is unavailable."
        />
      </Head>
      <main className="flex min-h-screen w-full flex-col items-center justify-center gap-7 px-4 sm:w-[95vw]">
        <h1 className="text-xl font-semibold md:text-3xl">
          {`${statusCode} | ${statusMesasge}`}
        </h1>
        <Button
          aria-label="go back to the previous page"
          onClick={() => Router.back()}
        >
          Go back
        </Button>
      </main>
    </>
  );
};

Four0Four.getLayout = (page) => <>{page}</>;

Four0Four.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Four0Four;
