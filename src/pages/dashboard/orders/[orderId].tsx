import type { OrderItemWithProduct } from "@/types/globals";
import { trpc } from "@/utils/trpc";
import { useIsMutating } from "@tanstack/react-query";
import Head from "next/head";
import Router from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";
import type { NextPageWithLayout } from "../../_app";

// external imports
import Button from "@/components/Button";
import DefaultLayout from "@/layouts/DefaultLayout";
import ErrorScreen from "@/screens/ErrorScreen";
import LoadingScreen from "@/screens/LoadingScreen";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/20/solid";

const UpdateOrder: NextPageWithLayout = () => {
  const orderId = Router.query.orderId as string;

  // get order query
  const orderQuery = trpc.admin.orders.getOne.useQuery(orderId, {
    enabled: Boolean(orderId),
  });

  // delete order mutation
  const deleteOrderMutation = trpc.admin.orders.delete.useMutation({
    onSuccess: async () => {
      toast.success("Order deleted");
      Router.push("/dashboard/orders");
    },
    onError: async (err) => {
      toast.error(err.message);
    },
  });

  // prev order mutation
  const prevOrderMutation = trpc.admin.orders.prev.useMutation({
    onSuccess: async (data) => {
      if (!data) {
        return toast.error("No previous order!");
      }
      Router.push(`/dashboard/orders/${data.id}`);
    },
    onError: async (err) => {
      toast.error(err.message);
    },
  });

  // next user mutation
  const nextOrderMutation = trpc.admin.orders.next.useMutation({
    onSuccess: async (data) => {
      if (!data) {
        return toast.error("No next order!");
      }
      Router.push(`/dashboard/orders/${data.id}`);
    },
    onError: async (err) => {
      toast.error(err.message);
    },
  });

  // refetch queries
  const utils = trpc.useContext();
  const number = useIsMutating();
  useEffect(() => {
    if (number === 0) {
      utils.admin.orders.getOne.invalidate(orderId);
      utils.orders.get.invalidate();
      utils.orders.getArchived.invalidate();
    }
  }, [number, orderId, utils]);

  // redirect if no order
  useEffect(() => {
    if (orderQuery.data === null) {
      Router.push("/dashboard/orders");
    }
  }, [orderQuery.data]);

  if (orderQuery.isLoading) {
    return <LoadingScreen />;
  }

  if (orderQuery.isError) {
    return <ErrorScreen error={orderQuery.error} />;
  }

  return (
    <>
      <Head>
        <title>Update Order | Amzn Store</title>
      </Head>
      <main className="min-h-screen pt-52 pb-14 md:pt-40">
        <div className="mx-auto grid w-full max-w-screen-sm gap-4 px-4 sm:w-[95vw]">
          <div className="flex items-center justify-between">
            <button
              aria-label="navigate back to orders page"
              className="flex-1"
              onClick={() => Router.push("/dashboard/orders")}
            >
              <ArrowLeftCircleIcon
                className="aspect-square w-10 text-primary transition-colors hover:text-orange-300 active:text-orange-500"
                aria-hidden="true"
              />
            </button>
            <div className="flex items-center">
              <button
                aria-label="navigate to previous order page"
                onClick={() => prevOrderMutation.mutateAsync(orderId)}
              >
                <ArrowLeftCircleIcon
                  className="aspect-square w-10 text-primary transition-colors hover:text-orange-300 active:text-orange-500"
                  aria-hidden="true"
                />
              </button>
              <button
                aria-label="navigate to next order page"
                onClick={() => nextOrderMutation.mutateAsync(orderId)}
              >
                <ArrowRightCircleIcon
                  className="aspect-square w-10 text-primary transition-colors hover:text-orange-300 active:text-orange-500"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>

          <div className="grid gap-4">
            {orderQuery.data?.items.map((item) => (
              <Item key={item.id} item={item} />
            ))}
            {Number(orderQuery.data?.items.length) > 0 ? (
              <Button
                aria-label="delete product"
                className="w-full bg-danger"
                onClick={() => deleteOrderMutation.mutateAsync(orderId)}
                disabled={deleteOrderMutation.isLoading}
              >
                {deleteOrderMutation.isLoading ? "Loading..." : "Delete order"}
              </Button>
            ) : null}
          </div>
        </div>
      </main>
    </>
  );
};

export default UpdateOrder;

UpdateOrder.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;

const Item = ({ item }: { item: OrderItemWithProduct }) => {
  // delete item mutation
  const deleteItemMutation = trpc.admin.orders.deleteItem.useMutation({
    onSuccess: async () => {
      toast.success("Item deleted");
    },
    onError: async (err) => {
      toast.error(err.message);
    },
  });

  return (
    <div key={item.id} className="flex items-center justify-between">
      <div className="flex items-center justify-between gap-5">
        {item.product.name}
      </div>
      <Button
        className="whitespace-nowrap bg-danger"
        onClick={() => deleteItemMutation.mutateAsync(item.id)}
      >
        {deleteItemMutation.isLoading ? "Loading..." : "Delete product"}
      </Button>
    </div>
  );
};
