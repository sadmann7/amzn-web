import type { NextPage } from "next";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { type ReactElement, type ReactNode } from "react";
import "../styles/globals.css";
import { trpc } from "../utils/trpc";

// import: components
import DefaultLayout from "@/components/layouts/DefaultLayout";
import ToastWrapper from "@/components/ToastWrapper";

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps<{
  session: Session | null;
}> & {
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
