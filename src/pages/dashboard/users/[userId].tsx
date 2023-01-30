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

// external imports
import Button from "@/components/Button";
import DefaultLayout from "@/layouts/DefaultLayout";
import ErrorScreen from "@/screens/ErrorScreen";
import LoadingScreen from "@/screens/LoadingScreen";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/20/solid";

const schema = z.object({
  role: z.nativeEnum(USER_ROLE),
});
type Inputs = z.infer<typeof schema>;

const UpdateUser: NextPageWithLayout = () => {
  const userId = Router.query.userId as string;

  // get user query
  const userQuery = trpc.admin.users.getOne.useQuery(userId, {
    enabled: Boolean(userId),
  });

  // update role mutation
  const updateRoleMutation = trpc.admin.users.updateRole.useMutation({
    onSuccess: async () => {
      toast.success("User role update!");
    },
    onError: async (err) => {
      toast.error(err.message);
    },
  });

  // update status mutation
  const updateStatusMutation = trpc.admin.users.updateStatus.useMutation({
    onSuccess: async () => {
      toast.success("User status updated!");
    },
    onError: async (err) => {
      toast.error(err.message);
    },
  });

  // delete user mutation
  const deleteUserMutation = trpc.admin.users.delete.useMutation({
    onSuccess: async () => {
      toast.success("User deleted!");
      Router.push("/dashboard/users");
    },
    onError: async (err) => {
      toast.error(err.message);
    },
  });

  // prev user mutation
  const prevUserMutation = trpc.admin.users.prev.useMutation({
    onSuccess: async (data) => {
      if (!data) return toast.error("No previous user!");
      Router.push(`/dashboard/users/${data.id}`);
    },
    onError: async (err) => {
      toast.error(err.message);
    },
  });

  // next user mutation
  const nextUserMutation = trpc.admin.users.next.useMutation({
    onSuccess: async (data) => {
      if (!data) return toast.error("No next user!");
      Router.push(`/dashboard/users/${data.id}`);
    },
    onError: async (err) => {
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
  const utils = trpc.useContext();
  const number = useIsMutating();
  useEffect(() => {
    if (number === 0) {
      utils.admin.users.getOne.invalidate(userId);
    }
  }, [number, userId, utils]);

  if (userQuery.isLoading) {
    return <LoadingScreen />;
  }

  if (userQuery.isError) {
    return <ErrorScreen />;
  }

  return (
    <>
      <Head>
        <title>Update User | Amzn Store</title>
      </Head>
      <main className="min-h-screen pt-52 pb-14 md:pt-40">
        <div className="mx-auto grid w-full max-w-screen-sm gap-4 px-4 sm:w-[95vw]">
          <div className="flex items-center justify-between">
            <button
              aria-label="navigate back to products page"
              className="flex-1"
              onClick={() => Router.push("/dashboard/users")}
            >
              <ArrowLeftCircleIcon
                className="aspect-square w-10 text-primary transition-colors hover:text-orange-300 active:text-orange-500"
                aria-hidden="true"
              />
            </button>
            <div className="flex items-center">
              <button
                aria-label="navigate to previous product page"
                onClick={() => prevUserMutation.mutateAsync(userId)}
              >
                <ArrowLeftCircleIcon
                  className="aspect-square w-10 text-primary transition-colors hover:text-orange-300 active:text-orange-500"
                  aria-hidden="true"
                />
              </button>
              <button
                aria-label="navigate to next product page"
                onClick={() => nextUserMutation.mutateAsync(userId)}
              >
                <ArrowRightCircleIcon
                  className="aspect-square w-10 text-primary transition-colors hover:text-orange-300 active:text-orange-500"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
          <div className="grid gap-4">
            <form
              aria-label="update user form"
              className="grid gap-2.5 whitespace-nowrap"
              onSubmit={handleSubmit(onSubmit)}
            >
              <fieldset className="grid gap-2">
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
              </fieldset>
              <Button
                aria-label="update role"
                className="w-full"
                disabled={updateRoleMutation.isLoading}
              >
                {updateRoleMutation.isLoading ? "Loading..." : "Update role"}
              </Button>
            </form>
            <Button
              aria-label="update status"
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
            <Button
              aria-label="delete user"
              className="w-full bg-danger"
              onClick={() => deleteUserMutation.mutateAsync(userId)}
              disabled={deleteUserMutation.isLoading}
            >
              {deleteUserMutation.isLoading ? "Loading..." : "Delete account"}
            </Button>
          </div>
        </div>
      </main>
    </>
  );
};

export default UpdateUser;

UpdateUser.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
