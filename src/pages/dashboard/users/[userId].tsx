import { formatEnum } from "@/utils/format";
import { trpc } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { USER_ROLE } from "@prisma/client";
import { useIsMutating } from "@tanstack/react-query";
import Head from "next/head";
import Router from "next/router";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import type { NextPageWithLayout } from "../../_app";

// components imports
import Button from "@/components/Button";
import DefaultLayout from "@/components/layouts/DefaultLayout";

const schema = z.object({
  role: z.nativeEnum(USER_ROLE),
});
type Inputs = z.infer<typeof schema>;

const UpdateUser: NextPageWithLayout = () => {
  const userId = Router.query.userId as string;

  //   trpc
  const utils = trpc.useContext();
  const userQuery = trpc.users.getUser.useQuery(userId, {
    staleTime: 1000 * 60 * 60 * 24,
  });
  // update role mutation
  const updateRoleMutation = trpc.admin.users.updateRole.useMutation({
    onSuccess: () => {
      toast.success("User role update!");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  // update status mutation
  const updateStatusMutation = trpc.admin.users.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("User status updated!");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  // react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ resolver: zodResolver(schema) });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await updateRoleMutation.mutateAsync({
      id: userId,
      role: data.role,
    });
  };
  // refetch user query
  const number = useIsMutating();
  useEffect(() => {
    if (number === 0) {
      utils.users.getUser.invalidate(userId);
    }
  }, [number, userId, utils]);

  return (
    <>
      <Head>
        <title>Update User | Amzn Store</title>
      </Head>
      <main className="mx-auto min-h-screen w-[95vw] max-w-screen-sm px-2 pt-52 pb-14 md:pt-40">
        {userQuery.isLoading ? (
          <div
            role="status"
            className="text-sm font-medium text-title md:text-base"
          >
            Loading...
          </div>
        ) : userQuery.isError ? (
          <div
            role="status"
            className="text-sm font-medium text-title md:text-base"
          >
            {`${userQuery.error.message} | ${userQuery.error.data?.httpStatus}`}
          </div>
        ) : (
          <div className="grid gap-4">
            <form
              aria-label="update user form"
              className="grid gap-2.5 whitespace-nowrap"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="grid gap-2">
                <label
                  htmlFor="update-user-role"
                  className="text-xs font-medium text-title md:text-sm"
                >
                  Product category
                </label>
                <select
                  id="update-user-role"
                  className="w-full px-4 py-2.5 text-xs font-medium text-title transition-colors md:text-sm"
                  {...register("role", { required: true })}
                  defaultValue={
                    updateRoleMutation.isLoading ? "" : userQuery.data?.role
                  }
                >
                  <option value="" hidden>
                    Select role
                  </option>
                  {Object.values(USER_ROLE).map((role) => (
                    <option key={role} value={role}>
                      {formatEnum(role)}
                    </option>
                  ))}
                </select>
                {errors.role ? (
                  <p className="text-sm font-medium text-danger">
                    {errors.role.message}
                  </p>
                ) : null}
              </div>
              <Button
                aria-label="Update role"
                className="w-full"
                disabled={updateRoleMutation.isLoading}
              >
                {updateRoleMutation.isLoading ? "Loading..." : "Update role"}
              </Button>
            </form>
            <Button
              aria-label="Update status"
              className="w-full"
              onClick={() =>
                updateStatusMutation.mutateAsync({
                  id: userId,
                  status: !userQuery.data?.active,
                })
              }
              disabled={updateStatusMutation.isLoading}
            >
              {updateStatusMutation.isLoading
                ? "Loading..."
                : userQuery.data?.active
                ? "Deactivate"
                : "Activate"}
            </Button>
          </div>
        )}
      </main>
    </>
  );
};

export default UpdateUser;

UpdateUser.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
