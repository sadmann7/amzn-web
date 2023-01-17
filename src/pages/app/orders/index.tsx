import type { NextPageWithLayout } from "@/pages/_app";
import { formatCurrency, formatEnum } from "@/utils/format";
import { trpc } from "@/utils/trpc";
import type { Order, Product, PRODUCT_CATEGORY, User } from "@prisma/client";
import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import { useMemo, useState } from "react";

// imports: components
import DefaultLayout from "@/components/layouts/DefaultLayout";
import CustomTable from "@/components/CustomTable";
import Button from "@/components/Button";

type OrderWithUser = Order & { user: User };

const Orders: NextPageWithLayout = () => {
  // tanstack/react-table
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
  });
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const columns = useMemo<ColumnDef<OrderWithUser, any>[]>(
    () => [
      {
        accessorKey: "id",
      },
      {
        accessorKey: "user.name",
        header: "Creater name",
      },
      {
        accessorKey: "user.email",
        header: "Creater Email",
      },
      {
        accessorKey: "createdAt",
        header: "Created at",
        enableColumnFilter: false,
        enableGlobalFilter: false,
        cell: ({ cell }) =>
          cell.getValue()
            ? dayjs(cell.getValue()).format("DD/MM/YYYY, hh:mm a")
            : "-",
      },
      {
        accessorKey: "updatedAt",
        header: "Updated at",
        enableColumnFilter: false,
        enableGlobalFilter: false,
        cell: ({ cell }) =>
          cell.getValue()
            ? dayjs(cell.getValue()).format("DD/MM/YYYY, hh:mm a")
            : "-",
      },
    ],
    []
  );

  // trpc
  const { data, isLoading, isError, isRefetching } =
    trpc.admin.orders.getOrders.useQuery(
      {
        page: pagination.pageIndex,
        perPage: pagination.pageSize,
      },
      { refetchOnWindowFocus: false }
    );

  return (
    <>
      <Head>
        <title>Orders | Amzn Store</title>
      </Head>
      <main className="min-h-screen bg-bg-gray pt-48 pb-14 md:pt-36">
        <div className="mx-auto w-full max-w-screen-2xl px-2 sm:w-[95vw]">
          <CustomTable<OrderWithUser>
            tableTitle={
              <>
                {`Orders (${data?.count ?? 0} entries)`}
                <Link href={"/"} className="ml-4">
                  <Button className="bg-primary-700">Add order</Button>
                </Link>
              </>
            }
            columns={columns}
            data={data?.orders ?? []}
            state={{
              sorting,
              pagination,
              columnVisibility,
              columnFilters,
            }}
            setSorting={setSorting}
            setColumnFilters={setColumnFilters}
            setColumnVisibility={setColumnVisibility}
            setPagination={setPagination}
            itemsCount={data?.count}
            isLoading={isLoading}
            isRefetching={isRefetching}
            isError={isError}
            manualFiltering
            manualPagination
            manualSorting
            rowHoverEffect
            disableGlobalFilter
            bodyRowProps={(row) => ({
              onClick: () => {
                const orderId = Number(row.getValue("id"));
                Router.push(`/app/orders/${orderId}`);
              },
            })}
          />
        </div>
      </main>
    </>
  );
};

export default Orders;

Orders.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
