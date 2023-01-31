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
  name: z.string().min(3).max(50),
  email: z.string().email(),
});
type Inputs = z.infer<typeof schema>;

const UpdateUser: NextPageWithLayout = () => {
  const userId = Router.query.userId as string;

  // get user query
  const userQuery = trpc.admin.users.getOne.useQuery(userId, {
    enabled: Boolean(userId),
  });

  // update user mutation
  const updateUserMutation = trpc.admin.users.update.useMutation({
    onSuccess: async () => {
      toast.success("User updated!");
    },
    onError: async (err) => {
      toast.error(err.message);
    },
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

  // react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>({ resolver: zodResolver(schema) });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await updateUserMutation.mutateAsync({ id: userId, ...data });
  };

  // prev user mutation
  const prevUserMutation = trpc.admin.users.prev.useMutation({
    onSuccess: async (data) => {
      if (!data) {
        return toast.error("No previous user!");
      }
      await Router.push(`/dashboard/users/${data.id}`);
      reset();
    },
    onError: async (err) => {
      toast.error(err.message);
    },
  });

  // next user mutation
  const nextUserMutation = trpc.admin.users.next.useMutation({
    onSuccess: async (data) => {
      if (!data) {
        return toast.error("No next user!");
      }
      await Router.push(`/dashboard/users/${data.id}`);
      reset();
    },
    onError: async (err) => {
      toast.error(err.message);
    },
  });

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
    return <ErrorScreen error={userQuery.error} />;
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
              aria-label="navigate back to users page"
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
                aria-label="navigate to previous user page"
                onClick={() => prevUserMutation.mutateAsync(userId)}
              >
                <ArrowLeftCircleIcon
                  className="aspect-square w-10 text-primary transition-colors hover:text-orange-300 active:text-orange-500"
                  aria-hidden="true"
                />
              </button>
              <button
                aria-label="navigate to next user page"
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
                  htmlFor="update-user-name"
                  className="text-xs font-medium text-title md:text-sm"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="update-user-name"
                  className="w-full px-4 py-2.5 text-xs font-medium text-title transition-colors md:text-sm"
                  {...register("name", { required: true })}
                  defaultValue={userQuery.data?.name as string}
                />
                {errors.name ? (
                  <p className="text-sm font-medium text-danger">
                    {errors.name.message}
                  </p>
                ) : null}
              </fieldset>
              <fieldset className="grid gap-2">
                <label
                  htmlFor="update-user-email"
                  className="text-xs font-medium text-title md:text-sm"
                >
                  Email
                </label>
                <input
                  type="text"
                  id="update-user-email"
                  className="w-full px-4 py-2.5 text-xs font-medium text-title transition-colors md:text-sm"
                  {...register("email", { required: true })}
                  defaultValue={userQuery.data?.email as string}
                />
                {errors.email ? (
                  <p className="text-sm font-medium text-danger">
                    {errors.email.message}
                  </p>
                ) : null}
              </fieldset>
              <Button
                aria-label="update account"
                className="w-full"
                disabled={updateUserMutation.isLoading}
              >
                {updateUserMutation.isLoading ? "Loading..." : "Update account"}
              </Button>
            </form>
            <fieldset className="grid gap-2">
              <label
                htmlFor="update-user-role"
                className="text-xs font-medium text-title md:text-sm"
              >
                Role
              </label>
              <select
                id="update-user-role"
                className="w-full px-4 py-2.5 text-xs font-medium text-title transition-colors md:text-sm"
                onChange={(e) => {
                  updateRoleMutation.mutateAsync({
                    id: userId,
                    role: e.target.value as USER_ROLE,
                  });
                }}
                defaultValue={userQuery.data?.role}
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
            </fieldset>
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
