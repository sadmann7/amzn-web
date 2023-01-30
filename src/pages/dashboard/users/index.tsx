import type { NextPageWithLayout } from "@/pages/_app";
import { formatEnum } from "@/utils/format";
import { trpc } from "@/utils/trpc";
import type { User, USER_ROLE } from "@prisma/client";
import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import Head from "next/head";
import Router from "next/router";
import { useMemo, useState } from "react";

// external imports
import CustomTable from "@/components/CustomTable";
import DefaultLayout from "@/layouts/DefaultLayout";

type TextField = string | undefined;
type CategoryField = USER_ROLE | undefined;

const Users: NextPageWithLayout = () => {
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

  const columns = useMemo<ColumnDef<User, any>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ cell }) =>
          cell.getValue() ? formatEnum(cell.getValue()) : "-",
      },
      {
        accessorKey: "active",
        header: "Status",
        cell: ({ cell }) => (cell.getValue() ? "Active" : "Inactive"),
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
    ],
    []
  );

  // get users query
  const { data, isLoading, isError, isRefetching } =
    trpc.admin.users.get.useQuery(
      {
        page: pagination.pageIndex,
        perPage: pagination.pageSize,
        name: columnFilters.find((f) => f.id === "name")?.value as TextField,
        email: columnFilters.find((f) => f.id === "email")?.value as TextField,
        role: columnFilters.find((f) => f.id === "role")
          ?.value as CategoryField,
        sortBy: sorting[0]?.id as
          | "name"
          | "email"
          | "role"
          | "active"
          | "createdAt"
          | undefined,
        sortDesc: sorting[0]?.desc,
      },
      { refetchOnWindowFocus: false }
    );

  return (
    <>
      <Head>
        <title>Users | Amzn Store</title>
      </Head>
      <main className="min-h-screen bg-bg-gray pt-48 pb-14 md:pt-36">
        <div className="mx-auto w-full max-w-screen-2xl px-4 sm:w-[95vw]">
          <CustomTable<User>
            tableTitle={`Users (${data?.count ?? 0} entries)`}
            columns={columns}
            data={data?.users ?? []}
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
                const userId = row.original.id as string;
                Router.push(`/dashboard/users/${userId}`);
              },
            })}
          />
        </div>
      </main>
    </>
  );
};

export default Users;

Users.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
