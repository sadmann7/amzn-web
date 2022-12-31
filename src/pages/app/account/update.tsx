import { trpc } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { signOut } from "next-auth/react";
import Head from "next/head";
import Router from "next/router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import type { NextPageWithLayout } from "../../_app";

// components imports
import Button from "@/components/Button";
import DefaultLayout from "@/components/layouts/DefaultLayout";

const schema = z.object({
  id: z.any(),
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 charachters" })
    .max(255, { message: "Name must be at most 255 charachters" }),
  email: z.string().email({ message: "Invalid email" }),
});
type Inputs = z.infer<typeof schema>;

const Update: NextPageWithLayout = () => {
  // trpc
  const sessionMutation = trpc.auth.getSession.useQuery();
  // update user mutation
  const updateUserMutation = trpc.users.updateOne.useMutation({
    onSuccess: async () => {
      sessionMutation.refetch();
      toast.success("User updated!");
    },
    onError: async (e) => {
      toast.error(e.message);
    },
  });
  // delete user mutation
  const deleteUserMutation = trpc.users.deleteOne.useMutation({
    onSuccess: async () => {
      await Router.push("/app");
      await signOut();
      toast.success("User deleted!");
    },
    onError: async (e) => {
      toast.error(e.message);
    },
  });
  // react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ resolver: zodResolver(schema) });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!sessionMutation.data?.user) return;
    await updateUserMutation.mutateAsync({
      id: sessionMutation.data.user.id,
      name: data.name,
      email: data.email,
    });
  };

  return (
    <>
      <Head>
        <title>Change Name, E-mail, and Delete Account | Amzn Store</title>
      </Head>
      <main className="mx-auto mb-10 min-h-screen w-[95vw] max-w-screen-sm px-2 pt-52 md:pt-44 lg:pt-40">
        {sessionMutation.isLoading ? (
          <div
            role="status"
            className="text-sm font-medium text-title md:text-base"
          >
            Loading...
          </div>
        ) : sessionMutation.isError ? (
          <div
            role="status"
            className="text-sm font-medium text-title md:text-base"
          >
            {`${sessionMutation.error.message} | ${sessionMutation.error.data?.httpStatus}`}
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
                  {...register("name", { required: "Name is required" })}
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
                  {...register("email", { required: "Email is required" })}
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
                aria-label="update store"
                className="w-full"
                disabled={updateUserMutation.isLoading}
              >
                {updateUserMutation.isLoading ? "Loading..." : "Update"}
              </Button>
            </form>{" "}
            <Button
              className="w-full bg-danger"
              onClick={() =>
                deleteUserMutation.mutateAsync(
                  sessionMutation.data?.user?.id as string
                )
              }
            >
              {deleteUserMutation.isLoading ? "Deleting..." : "Delete account"}
            </Button>
          </div>
        )}
      </main>
    </>
  );
};

export default Update;

Update.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
