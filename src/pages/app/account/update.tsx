import { getServerAuthSession } from "@/server/common/get-server-auth-session";
import { trpc } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import type { GetServerSideProps } from "next";
import { signOut } from "next-auth/react";
import Head from "next/head";
import Router from "next/router";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import type { NextPageWithLayout } from "../../_app";

// external imports
import Button from "@/components/Button";
import ConfirmationModal from "@/components/ConfirmationModal";
import DefaultLayout from "@/layouts/DefaultLayout";
import ErrorScreen from "@/screens/ErrorScreen";
import LoadingScreen from "@/screens/LoadingScreen";

const schema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 charachters" })
    .max(50, { message: "Name must be at most 50 charachters" }),
  email: z.string().email({ message: "Invalid email" }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 charachters" })
    .max(11, { message: "Phone number must be at most 11 charachters" }),
});
type Inputs = z.infer<typeof schema>;

const Update: NextPageWithLayout = () => {
  // get session query
  const sessionMutation = trpc.users.getSession.useQuery();

  // update user mutation
  const updateUserMutation = trpc.users.update.useMutation({
    onSuccess: async () => {
      sessionMutation.refetch();
      toast.success("User updated!");
    },
    onError: async (e) => {
      toast.error(e.message);
    },
  });

  // delete user mutation
  const deleteUserMutation = trpc.users.delete.useMutation({
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
      ...data,
    });
  };

  // headless-ui modal
  const [isOpen, setIsOpen] = useState(false);

  if (sessionMutation.isLoading) {
    return <LoadingScreen />;
  }

  if (sessionMutation.isError) {
    return <ErrorScreen error={sessionMutation.error} />;
  }

  return (
    <>
      <Head>
        <title>Change Name, E-mail, and Delete Account | Amzn Store</title>
      </Head>
      <main className="mx-auto min-h-screen w-full max-w-screen-sm px-4 pt-52 pb-14 sm:w-[95vw] md:pt-40">
        <ConfirmationModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          name="Delete Account"
          description="Are you sure you want to delete your account? All of your
          data will be permanently removed. This action cannot be
          undone."
          onConfirm={async () => {
            await deleteUserMutation.mutateAsync(
              sessionMutation.data?.user?.id as string
            );
            setIsOpen(false);
          }}
          isLoading={deleteUserMutation.isLoading}
        />
        <div className="grid gap-4">
          <form
            aria-label="update account form"
            className="grid gap-2.5 whitespace-nowrap"
            onSubmit={handleSubmit(onSubmit)}
          >
            <fieldset className="grid gap-2">
              <label
                htmlFor="update-account-name"
                className="text-xs font-medium text-title md:text-sm"
              >
                Name
              </label>
              <input
                type="text"
                id="update-account-name"
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
            </fieldset>
            <fieldset className="grid gap-2">
              <label
                htmlFor="update-account-email"
                className="text-xs font-medium text-title md:text-sm"
              >
                Email
              </label>
              <input
                type="text"
                id="update-account-email"
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
            </fieldset>
            <fieldset className="grid gap-2">
              <label
                htmlFor="update-account-phone"
                className="text-xs font-medium text-title md:text-sm"
              >
                Phone number
              </label>
              <input
                type="text"
                id="update-account-phone"
                className="w-full px-4 py-2.5 text-xs font-medium text-title transition-colors placeholder:text-lowkey/80 md:text-sm"
                placeholder="Enter your phone number"
                {...register("phone", { required: true })}
                defaultValue={
                  updateUserMutation.isLoading
                    ? ""
                    : (sessionMutation.data?.user?.phone as string)
                }
              />
              {errors.phone ? (
                <p className="text-sm font-medium text-danger">
                  {errors.phone.message}
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
          <Button className="w-full bg-danger" onClick={() => setIsOpen(true)}>
            Delete account
          </Button>
        </div>
      </main>
    </>
  );
};

export default Update;

Update.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession({
    req: ctx.req,
    res: ctx.res,
  });

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
