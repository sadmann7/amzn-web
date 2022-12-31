import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { trpc } from "../utils/trpc";
import "../styles/globals.css";

// components imports
import DefaultLayout from "@/components/layouts/DefaultLayout";
import ToastWrapper from "@/components/ToastWrapper";
import Head from "next/head";

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps<{ session: Session | null }> & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);

  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <title>Amzn Store</title>
      </Head>
      {getLayout(<Component {...pageProps} />)}
      <ToastWrapper />
    </SessionProvider>
  );
}

export default trpc.withTRPC(MyApp);
