import type { NextPageWithLayout } from "@/pages/_app";
import { formatEnum } from "@/utils/format";
import { trpc } from "@/utils/trpc";
import type { User } from "@prisma/client";
import type {
  ColumnDef,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import Head from "next/head";
import Router from "next/router";
import { useMemo, useState } from "react";

// components imports
import CustomTable from "@/components/CustomTable";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import Loader from "@/components/Loader";

const Users: NextPageWithLayout = () => {
  // trpc
  const usersQuery = trpc.users.getUsers.useQuery(undefined, {
    staleTime: 1000 * 60 * 60 * 24,
  });

  // tanstack/react-table
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
    createdBy: false,
    updatedBy: false,
    updatedAt: false,
  });
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
        <title>Users | Amzn Store</title>
      </Head>
      <main className="min-h-screen bg-bg-gray pt-48 pb-14 md:pt-36">
        <div className="mx-auto w-full max-w-screen-2xl px-2 sm:w-[95vw]">
          <CustomTable<User>
            tableTitle={`Users (${usersQuery.data?.length ?? 0} entries)`}
            columns={columns}
            data={usersQuery.data ?? []}
            state={{
              columnVisibility,
              columnFilters,
            }}
            setColumnFilters={setColumnFilters}
            setColumnVisibility={setColumnVisibility}
            isLoading={usersQuery.isLoading}
            isError={usersQuery.isError}
            rowHoverEffect
            bodyRowProps={(row) => ({
              onClick: () => {
                const id = row.original.id as string;
                Router.push(`/dashboard/users/${id}`);
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
