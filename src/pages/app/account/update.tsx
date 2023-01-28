import { trpc } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { signOut } from "next-auth/react";
import Head from "next/head";
import Router from "next/router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import type { NextPageWithLayout } from "../../_app";

// external imports
import Button from "@/components/Button";
import DefaultLayout from "@/layouts/DefaultLayout";
import ErrorScreen from "@/screens/ErrorScreen";
import LoadingScreen from "@/screens/LoadingScreen";

const schema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 charachters" })
    .max(255, { message: "Name must be at most 255 charachters" }),
  email: z.string().email({ message: "Invalid email" }),
});
type Inputs = z.infer<typeof schema>;

const Update: NextPageWithLayout = () => {
  const sessionMutation = trpc.users.getSession.useQuery();
  // update user mutation
  const updateUserMutation = trpc.users.updateUser.useMutation({
    onSuccess: async () => {
      sessionMutation.refetch();
      toast.success("User updated!");
    },
    onError: async (e) => {
      toast.error(e.message);
    },
  });
  // delete user mutation
  const deleteUserMutation = trpc.users.deleteUser.useMutation({
    onSuccess: async () => {
      await Router.push("/app");
      await signOut();
      toast.success("User deleted!");
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
    await updateUserMutation.mutateAsync({
      id: sessionMutation.data?.user?.id as string,
      name: data.name,
      email: data.email,
    });
  };

  if (sessionMutation.isLoading) {
    return <LoadingScreen />;
  }

  if (sessionMutation.isError) {
    return <ErrorScreen />;
  }

  return (
    <>
      <Head>
        <title>Change Name, E-mail, and Delete Account | Amzn Store</title>
      </Head>
      <main className="mx-auto min-h-screen w-full max-w-screen-sm px-4 pt-52 pb-14 sm:w-[95vw] md:pt-40">
        <div className="grid gap-4">
          <form
            aria-label="update user form"
            className="grid gap-2.5 whitespace-nowrap"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid gap-2">
              <label
                htmlFor="update-user-name"
                className="text-xs font-medium text-title md:text-sm"
              >
                Name
              </label>
              <input
                type="text"
                id="update-user-name"
                className="w-full px-4 py-2.5 text-xs font-medium text-title transition-colors placeholder:text-lowkey/80 md:text-sm"
                placeholder="Enter your name"
                {...register("name", { required: true })}
                defaultValue={
                  updateUserMutation.isLoading
                    ? ""
                    : (sessionMutation.data?.user?.name as string)
                }
              />
              {errors.name ? (
                <p className="text-sm font-medium text-danger">
                  {errors.name.message}
                </p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <label
                htmlFor="update-user-email"
                className="text-xs font-medium text-title md:text-sm"
              >
                Email
              </label>
              <input
                type="text"
                id="update-user-email"
                className="w-full px-4 py-2.5 text-xs font-medium text-title transition-colors placeholder:text-lowkey/80 md:text-sm"
                placeholder="Enter your email addres"
                {...register("email", { required: true })}
                defaultValue={
                  updateUserMutation.isLoading
                    ? ""
                    : (sessionMutation.data?.user?.email as string)
                }
              />
              {errors.email ? (
                <p className="text-sm font-medium text-danger">
                  {errors.email.message}
                </p>
              ) : null}
            </div>
            <Button
              aria-label="update user"
              className="w-full"
              disabled={updateUserMutation.isLoading}
            >
              {updateUserMutation.isLoading ? "Loading..." : "Update user"}
            </Button>
          </form>
          <Button
            className="w-full bg-danger"
            onClick={() =>
              deleteUserMutation.mutateAsync(
                sessionMutation.data?.user?.id as string
              )
            }
            disabled={deleteUserMutation.isLoading}
          >
            {deleteUserMutation.isLoading ? "Deleting..." : "Delete account"}
          </Button>
        </div>
      </main>
    </>
  );
};

export default Update;

Update.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
