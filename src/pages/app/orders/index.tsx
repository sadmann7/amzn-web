import type { NextPageWithLayout } from "@/pages/_app";
import { formatCurrency } from "@/utils/format";
import { trpc } from "@/utils/trpc";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Router from "next/router";
import { useEffect } from "react";

// imports: components
import DefaultLayout from "@/components/layouts/DefaultLayout";
import ErrorScreen from "@/components/screens/ErrorScreen";
import LoadingScreen from "@/components/screens/LoadingScreen";

const Orders: NextPageWithLayout = () => {
  const { status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      Router.push("/api/auth/signin");
    }
  }, [status]);

  // trpc
  const ordersQuery = trpc.orders.getCurrentUserOrders.useQuery();
  const orderItemsQuery = trpc.orders.getCurrentUserOrderItems.useQuery();

  if (ordersQuery.isLoading) {
    return <LoadingScreen />;
  }

  if (ordersQuery.isError) {
    return <ErrorScreen />;
  }

  if (ordersQuery.data?.length === 0) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="text-xl font-semibold text-title md:text-3xl">
          You have no orders
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Orders | Amzn Store</title>
      </Head>
      <main className="min-h-screen pt-48 pb-14 md:pt-36">
        <div className="mx-auto w-full max-w-screen-lg px-2 sm:w-[95vw]">
          <div className="flex flex-wrap items-center justify-between">
            <h1 className="text-xl font-semibold text-title md:text-2xl">
              Your Orders
            </h1>
            <div>Search all orders</div>
          </div>
          <div className="mt-5 grid gap-8">
            {ordersQuery.data?.map((order) => (
              <div key={order.id} className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-xs font-medium text-title md:text-sm">
                      Order Placed:{" "}
                      <span className="text-xs font-normal md:text-sm">
                        {dayjs(order.createdAt).format("DD MMM YYYY")}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-title md:text-sm">
                      Total:{" "}
                      <span className="text-sm font-normal md:text-sm">
                        {order.items.length}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid gap-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-5 md:gap-8"
                    >
                      <Image
                        src={item.product.image}
                        alt={item.product.title}
                        width={80}
                        height={80}
                        loading="lazy"
                        className="h-20 w-20 object-contain"
                      />
                      <div className="flex flex-1 flex-col gap-2">
                        <div className="text-xs font-medium text-title line-clamp-1 md:text-sm">
                          {item.product.title}
                        </div>
                        <div className="text-xs font-medium text-title md:text-sm">
                          Quantity: {item.quantity}
                        </div>
                        <div className="text-xs font-medium text-title md:text-sm">
                          Price:
                          {` ${item.quantity} x ${formatCurrency(
                            item.product.price,
                            "USD"
                          )} = `}
                          {formatCurrency(
                            item.product.price * item.quantity,
                            "USD"
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Orders;

Orders.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;