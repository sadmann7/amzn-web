import { formatCurrency } from "@/utils/format";
import { trpc } from "@/utils/trpc";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Router from "next/router";
import type { NextPageWithLayout } from "../../_app";

// imports: components
import DefaultLayout from "@/components/layouts/DefaultLayout";
import ErrorScreen from "@/components/screens/ErrorScreen";
import LoadingScreen from "@/components/screens/LoadingScreen";

const ShowOrder: NextPageWithLayout = () => {
  const orderId = Number(Router.query.orderId);

  // get order query
  const orderQuery = trpc.orders.getOrder.useQuery(orderId);

  if (orderQuery.isLoading) {
    return <LoadingScreen />;
  }

  if (orderQuery.isError) {
    return <ErrorScreen />;
  }

  return (
    <>
      <Head>
        <title>Order | Amzn Store</title>
      </Head>
      <main className="min-h-screen pt-48 pb-14 md:pt-36">
        <div className="mx-auto w-full max-w-screen-lg px-4 sm:w-[95vw]">
          {orderQuery.data.items.map((item) => (
            <div key={item.id}>
              <div className="flex items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <Image
                    src={item.product.image}
                    alt={item.product.title}
                    width={80}
                    height={80}
                    className="h-20 w-20 object-contain"
                  />
                  <div className="grid gap-0.5">
                    <Link
                      aria-label={`go to ${item.product.title}`}
                      href={`/app/products/${item.product.id}`}
                    >
                      <div className="text-sm font-semibold text-title line-clamp-2 hover:text-primary md:text-base">
                        {item.product.title}
                      </div>
                    </Link>
                    <div className="text-sm text-gray-500 md:text-base">
                      {item.quantity} x{" "}
                      {formatCurrency(item.product.price, "USD")}
                    </div>
                  </div>
                </div>
                <div className="text-sm font-semibold text-title md:text-base">
                  ${item.product.price * item.quantity}
                </div>
              </div>
              <hr className="my-4" />
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default ShowOrder;

ShowOrder.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
