import { getServerAuthSession } from "@/server/common/get-server-auth-session";
import { trpc } from "@/utils/trpc";
import { STRIPE_SUBSCRIPTION_STATUS } from "@prisma/client";
import type { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Router from "next/router";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import type { NextPageWithLayout } from "../../_app";

// external imports
import Button from "@/components/ui/Button";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import ErrorScreen from "@/components/screens/ErrorScreen";
import LoadingScreen from "@/components/screens/LoadingScreen";

const Prime: NextPageWithLayout = () => {
  const { status } = useSession();

  // subscription status query
  const subscriptionStatusQuery = trpc.users.getSubscriptionStatus.useQuery(
    undefined,
    {
      enabled: status === "authenticated",
    }
  );

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
      <main className="grid min-h-screen place-items-center pb-14 pt-48 md:pt-36">
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
              <Button
                aria-label="Manage your Prime membership"
                className="mt-3.5 min-w-[8rem]"
                onClick={async () => {
                  await billingPortalSessionMutation.mutateAsync();
                }}
                disabled={billingPortalSessionMutation.isLoading}
              >
                {billingPortalSessionMutation.isLoading
                  ? "Loading..."
                  : "Manage your Prime membership"}
              </Button>
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
              <Button
                aria-label="Start your 30-day free trial"
                className="mt-3.5 min-w-[8rem]"
                onClick={async () => {
                  await checkoutSessionMutation.mutateAsync();
                }}
                disabled={checkoutSessionMutation.isLoading}
              >
                {checkoutSessionMutation.isLoading
                  ? "Loading..."
                  : "Start your 30-day free trial"}
              </Button>
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
  const session = await getServerAuthSession({
    req: ctx.req,
    res: ctx.res,
  });

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
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
