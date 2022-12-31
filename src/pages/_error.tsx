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
        <title>Error | Top Ten Agro Chemicals</title>
        <meta
          name="description"
          content="The page you are looking for is unavailable."
        />
      </Head>
      <main className="container-res flex min-h-screen flex-col items-center justify-center gap-7">
        <h1 className="text-2xl font-semibold md:text-3xl">
          {`${statusCode} | ${statusMesasge}`}
        </h1>
        <Button
          aria-label="go back to the previous page"
          className="bg-neutral-700"
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
