import type { OrderItemWithProduct } from "@/types/globals";
import { trpc } from "@/utils/trpc";
import { useIsMutating } from "@tanstack/react-query";
import Head from "next/head";
import Router from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";
import type { NextPageWithLayout } from "../../_app";

// components imports
import Button from "@/components/Button";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import ErrorScreen from "@/components/screens/ErrorScreen";
import LoadingScreen from "@/components/screens/LoadingScreen";

const UpdateOrder: NextPageWithLayout = () => {
  const orderId = Number(Router.query.orderId);
  const utils = trpc.useContext();

  // get order query
  const orderQuery = trpc.admin.orders.getOrder.useQuery(orderId);
  // delete order mutation
  const deleteOrderMutation = trpc.admin.orders.deleteOrder.useMutation({
    onSuccess: async () => {
      toast.success("Order deleted");
      Router.push("/dashboard/orders");
    },
    onError: async (err) => {
      toast.error(err.message);
    },
  });
  // refetch order query
  const number = useIsMutating();
  useEffect(() => {
    if (number === 0) {
      utils.admin.orders.getOrder.invalidate(orderId);
    }
  }, [number, orderId, utils]);

  if (orderQuery.isLoading) {
    return <LoadingScreen />;
  }

  if (orderQuery.isError) {
    return <ErrorScreen />;
  }

  return (
    <>
      <Head>
        <title>Update Order | Amzn Store</title>
      </Head>
      <main className="mx-auto min-h-screen w-full max-w-screen-sm px-4 pt-52 pb-14 sm:w-[95vw] md:pt-40">
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
        {item.product.title}
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
