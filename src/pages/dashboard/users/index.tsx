import type { NextPageWithLayout } from "@/pages/_app";
import { trpc } from "@/utils/trpc";
import Head from "next/head";

// components imports
import Button from "@/components/Button";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import Loader from "@/components/Loader";
import ProductList from "@/components/ProductList";
import Router from "next/router";

const Users: NextPageWithLayout = () => {
  // trpc
  const usersQuery = trpc.users.getUsers.useQuery(undefined, {
    staleTime: 1000 * 60 * 60 * 24,
  });

  if (usersQuery.isLoading) {
    return <Loader />;
  }

  if (usersQuery.isError) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="text-xl font-semibold text-title md:text-3xl">
          Error: {usersQuery.error.message}
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Users| Amzn Store</title>
      </Head>
      <main className="min-h-screen bg-bg-gray pt-48 pb-14 md:pt-36">
        <div className="flex flex-col gap-5 pb-14">
          <div className="mx-auto w-full max-w-screen-2xl px-2 sm:w-[95vw]">
            <div className="flex flex-col gap-2">
              {usersQuery.data.map((user) => (
                <div key={user.id} className="flex items-center gap-2">
                  <Button
                    onClick={() => Router.push(`/dashboard/users/${user.id}`)}
                  >
                    Edit user
                  </Button>
                  <p>{user.name}</p>
                  <p>{user.email}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Users;

Users.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
