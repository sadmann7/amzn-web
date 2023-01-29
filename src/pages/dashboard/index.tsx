import Head from "next/head";
import Link from "next/link";
import type { NextPageWithLayout } from "../_app";

// external imports
import DefaultLayout from "@/layouts/DefaultLayout";

const dashboardRoutes = [
  {
    name: "Users",
    path: "/dashboard/users",
  },
  {
    name: "Products",
    path: "/dashboard/products",
  },
  {
    name: "Orders",
    path: "/dashboard/orders",
  },
];

const Dashboard: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Dashboard | Amzn Store</title>
      </Head>
      <main className="mx-auto min-h-screen w-full max-w-[200px] pt-52 pb-14 sm:w-[95vw] md:pt-40">
        <ul className="flex flex-col gap-2">
          {dashboardRoutes.map((route) => (
            <li key={route.name}>
              <Link
                aria-label={`navigate to ${route.name} page`}
                href={route.path}
                className="block bg-primary px-4 py-2 text-center text-sm font-medium text-white hover:bg-opacity-80 active:bg-opacity-90 md:text-base"
              >
                {route.name}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
};

export default Dashboard;

Dashboard.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
