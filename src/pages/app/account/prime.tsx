import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { trpc } from "@/utils/trpc";
import { STRIPE_SUBSCRIPTION_STATUS } from "@prisma/client";
import type { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import Router from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";
import type { NextPageWithLayout } from "../../_app";

// external imports
import DefaultLayout from "@/layouts/DefaultLayout";
import ErrorScreen from "@/screens/ErrorScreen";
import LoadingScreen from "@/screens/LoadingScreen";

const Prime: NextPageWithLayout = () => {
  // subscription status query
  const subscriptionStatusQuery = trpc.users.getSubscriptionStatus.useQuery();

  // checkout session mutation
  const checkoutSessionMutation = trpc.stripe.createCheckoutSession.useMutation(
    {
      onSuccess: async (data) => {
        if (!data.checkoutUrl) return;
        Router.push(data.checkoutUrl);
        toast.success("Redirecting to checkout...");
      },
      onError: async (err) => {
        toast.error(err.message);
      },
    }
  );

  // billing portal session mutation
  const billingPortalSessionMutation =
    trpc.stripe.createBillingPortalSession.useMutation({
      onSuccess: async (data) => {
        if (!data.billingPortalUrl) return;
        Router.push(data.billingPortalUrl);
        toast.success("Redirecting to billing portal...");
      },
      onError: async (err) => {
        toast.error(err.message);
      },
    });

  // refetch subscription status query
  const apiUtils = trpc.useContext();
  const number = 0;
  useEffect(() => {
    if (number === 0) {
      apiUtils.users.getSubscriptionStatus.invalidate();
    }
    subscriptionStatusQuery.refetch();
  }, [apiUtils, subscriptionStatusQuery]);

  if (subscriptionStatusQuery.isLoading) {
    return <LoadingScreen />;
  }

  if (subscriptionStatusQuery.isError) {
    return <ErrorScreen error={subscriptionStatusQuery.error} />;
  }

  return (
    <>
      <Head>
        <title>Prime | Amzn Store</title>
      </Head>
      <main className="grid min-h-screen place-items-center pt-48 pb-14 md:pt-36">
        <div className="mx-auto w-full max-w-screen-sm px-4 sm:w-[95vw]">
          {subscriptionStatusQuery.data ===
          STRIPE_SUBSCRIPTION_STATUS.active ? (
            <div className="flex flex-col items-center gap-0.5">
              <h1 className="text-center text-2xl font-semibold text-title sm:text-3xl">
                You are a Prime member
              </h1>
              <p className="text-center text-sm text-lowkey sm:text-base">
                Thank you for being a Prime member
              </p>
              <button
                aria-label="Manage your Prime membership"
                className="mt-3.5 bg-orange-300 py-1.5 px-4 text-sm font-semibold text-title transition-colors enabled:hover:bg-orange-400/80 sm:text-base"
                onClick={async () => {
                  await billingPortalSessionMutation.mutateAsync();
                }}
                disabled={billingPortalSessionMutation.isLoading}
              >
                Manage your Prime membership
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-0.5">
              <h1 className="text-center text-2xl font-semibold text-title sm:text-3xl">
                Join Prime to get free shipping, ad-free music, exclusive deals,
                and more
              </h1>
              <p className="text-center text-sm text-lowkey sm:text-base">
                Get unlimited free two-day shipping, ad-free music, exclusive
                deals, and more
              </p>
              <button
                aria-label="Start your 30-day free trial"
                className="mt-3.5 bg-orange-300 py-1.5 px-4 text-sm font-semibold text-title transition-colors enabled:hover:bg-orange-400/80 sm:text-base"
                onClick={async () => {
                  await checkoutSessionMutation.mutateAsync();
                }}
                disabled={checkoutSessionMutation.isLoading}
              >
                Start your 30-day free trial
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Prime;

Prime.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await unstable_getServerSession(
    ctx.req,
    ctx.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
