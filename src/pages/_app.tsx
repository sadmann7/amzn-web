import { type ReactElement, type ReactNode, useState } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { trpc } from "../utils/trpc";
import {
  type DehydratedState,
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
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
