import type { NextPageWithLayout } from "@/pages/_app";
import type { OrderItemWithProduct, OrderWithItems } from "@/types/globals";
import { formatCurrency } from "@/utils/format";
import { trpc } from "@/utils/trpc";
import { Tab } from "@headlessui/react";
import { useIsMutating } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Router from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

// imports: components
import Button from "@/components/Button";
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

  // queries
  const utils = trpc.useContext();
  const ordersQuery = trpc.orders.getUserOrders.useQuery();
  const archivedOrdersQuery = trpc.orders.getUserArchivedOrders.useQuery();
  // refetch queries
  const number = useIsMutating();
  useEffect(() => {
    if (number === 0) {
      utils.orders.getUserOrders.invalidate();
      utils.orders.getUserArchivedOrders.invalidate();
    }
  }, [number, utils]);

  // headlessui
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tabs = [{ name: "Orders" }, { name: "Archived orders" }];

  // renders
  if (ordersQuery.isLoading || archivedOrdersQuery.isLoading) {
    return <LoadingScreen />;
  }

  if (ordersQuery.isError || archivedOrdersQuery.isError) {
    return <ErrorScreen />;
  }

  if (
    ordersQuery.data?.length === 0 &&
    archivedOrdersQuery.data?.length === 0
  ) {
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
        <div className="mx-auto w-full max-w-screen-lg px-4 sm:w-[95vw]">
          <h1 className="text-xl font-semibold text-title md:text-2xl">
            Your Orders
          </h1>
          <div className="mt-5">
            <Tab.Group
              selectedIndex={selectedIndex}
              onChange={setSelectedIndex}
            >
              <Tab.List className="flex gap-5">
                {tabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    className="text-sm font-medium text-link ring-2 ring-white hover:text-opacity-80 focus:outline-none ui-selected:border-b-2 ui-selected:border-primary ui-selected:font-bold ui-selected:text-title md:text-base"
                  >
                    {tab.name}
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels className="mt-2">
                <Tab.Panel>
                  {ordersQuery.data?.every(
                    (order) => order.items.length === 0
                  ) ? (
                    <div className="mt-40 grid place-items-center">
                      <div className="text-xl font-semibold text-title md:text-3xl">
                        You have no unarchived orders
                      </div>
                    </div>
                  ) : (
                    <GroupedOrders data={ordersQuery.data} />
                  )}
                </Tab.Panel>
                <Tab.Panel>
                  {archivedOrdersQuery.data?.every(
                    (order) => order.items.length === 0
                  ) ? (
                    <div className="mt-40 grid place-items-center">
                      <div className="text-xl font-semibold text-title md:text-3xl">
                        You have no archived orders
                      </div>
                    </div>
                  ) : (
                    <GroupedOrders data={archivedOrdersQuery.data} />
                  )}
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </main>
    </>
  );
};

export default Orders;

Orders.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;

// GroupedOrders
const GroupedOrders = ({ data }: { data: OrderWithItems[] }) => {
  return (
    <div className="mt-5 grid gap-8">
      {data
        .filter((order) => order.items.length > 0)
        .map((order) => (
          <div key={order.id} className="grid gap-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs font-medium md:text-sm">
                  <span className="text-title">Order Placed:</span>
                  <span className="text-gray-500">
                    {dayjs(order.createdAt).format("DD MMM YYYY")},
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium md:text-sm">
                  <span className="text-title">Total:</span>
                  <span className="text-gray-500">
                    {order.items.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                </div>
              </div>
              <Link href={`/app/orders/${order.id}`}>
                <Button className="w-full min-w-[128px] whitespace-nowrap bg-gray-200 text-title">
                  Go to order
                </Button>
              </Link>
            </div>
            <div className="grid gap-4">
              {order.items.map((item) => (
                <Item key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

// Item
const Item = ({ item }: { item: OrderItemWithProduct }) => {
  // trpc
  const updateItemMutation = trpc.orders.updateItem.useMutation({
    onSuccess: async () => {
      toast.success("Product archived!");
    },
    onError: async (err) => {
      toast.error(err.message);
    },
  });

  return (
    <div className="flex items-center justify-between gap-5 md:gap-8">
      <div className="flex items-center gap-5">
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
            Quantity: <span className="text-gray-500">{item.quantity}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium md:text-sm">
            <span className="text-title">Price:</span>
            <span className="text-gray-500">
              {`${item.quantity} x ${formatCurrency(
                item.product.price,
                "USD"
              )} =`}
            </span>
            <span className="text-gray-500">
              {formatCurrency(item.product.price * item.quantity, "USD")}
            </span>
          </div>
        </div>
      </div>
      <div className="grid gap-2.5">
        <Link href={`/app/products/${item.productId}`}>
          <Button
            aria-label="go to product"
            className="w-full min-w-[128px] whitespace-nowrap bg-gray-200 text-title"
          >
            Go to prduct
          </Button>
        </Link>
        <Button
          aria-label={item.archived ? "unarchive" : "archive"}
          className="w-full min-w-[128px] whitespace-nowrap bg-gray-200 text-title"
          onClick={() => {
            updateItemMutation.mutateAsync({
              id: item.id,
              archived: item.archived,
            });
          }}
          disabled={updateItemMutation.isLoading}
        >
          {updateItemMutation.isLoading
            ? item.archived
              ? "Unarchiving..."
              : "Archiving..."
            : item.archived
            ? "Unarchive"
            : "Archive"}
        </Button>
      </div>
    </div>
  );
};
