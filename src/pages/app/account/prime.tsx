import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { trpc } from "@/utils/trpc";
import type { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import Router from "next/router";
import { Fragment } from "react";
import type { NextPageWithLayout } from "../../_app";

// external imports
import DefaultLayout from "@/layouts/DefaultLayout";

const Prime: NextPageWithLayout = () => {
  // get subscription status
  const subscriptionStatusQuery = trpc.users.getSubscriptionStatus.useQuery();

  return (
    <>
      <Head>
        <title>Amzn Prime | Amzn Store</title>
      </Head>
      <main className="grid min-h-screen place-items-center pt-48 pb-14 md:pt-36">
        <div className="mx-auto flex w-full max-w-screen-sm flex-col items-center gap-4 px-4 sm:w-[95vw]">
          {!subscriptionStatusQuery.isLoading &&
            subscriptionStatusQuery.data !== null && (
              <Fragment>
                <p className="text-xl text-gray-700">
                  Your subscription is {subscriptionStatusQuery.data}.
                </p>
                <ManageBillingButton />
              </Fragment>
            )}
          {!subscriptionStatusQuery.isLoading &&
            subscriptionStatusQuery.data === null && (
              <Fragment>
                <p className="text-xl text-gray-700">
                  You are not subscribed!!!
                </p>
                <UpgradeButton />
              </Fragment>
            )}
        </div>
      </main>
    </>
  );
};

export default Prime;

Prime.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;

const UpgradeButton = () => {
  const checkoutSessionMutation =
    trpc.stripe.createCheckoutSession.useMutation();

  return (
    <button
      className="w-fit cursor-pointer rounded-md bg-blue-500 px-5 py-2 text-lg font-semibold text-white shadow-sm duration-150 hover:bg-blue-600"
      onClick={async () => {
        const { checkoutUrl } = await checkoutSessionMutation.mutateAsync();
        if (checkoutUrl) {
          Router.push(checkoutUrl);
        }
      }}
    >
      Upgrade account
    </button>
  );
};

const ManageBillingButton = () => {
  const billingPortalSessionMutation =
    trpc.stripe.createBillingPortalSession.useMutation();

  return (
    <button
      className="w-fit cursor-pointer rounded-md bg-blue-500 px-5 py-2 text-lg font-semibold text-white shadow-sm duration-150 hover:bg-blue-600"
      onClick={async () => {
        const { billingPortalUrl } =
          await billingPortalSessionMutation.mutateAsync();
        if (billingPortalUrl) {
          Router.push(billingPortalUrl);
        }
      }}
    >
      Manage subscription and billing
    </button>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
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
