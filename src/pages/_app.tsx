import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
  type DehydratedState,
} from "@tanstack/react-query";
import type { NextPage } from "next";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useState, type ReactElement, type ReactNode } from "react";
import "../styles/globals.css";
import { trpc } from "../utils/trpc";

// components imports
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
  dehydratedState: DehydratedState;
}> & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <SessionProvider session={pageProps.session}>
          <Head>
            <title>Amzn Store</title>
          </Head>
          {getLayout(<Component {...pageProps} />)}
          <ToastWrapper />
        </SessionProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default trpc.withTRPC(MyApp);
