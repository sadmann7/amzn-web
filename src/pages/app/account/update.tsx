import { trpc } from "@/utils/trpc";
import { Dialog, Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signOut } from "next-auth/react";
import Head from "next/head";
import Router from "next/router";
import { Fragment, useState, type Dispatch, type SetStateAction } from "react";
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
        <CustomModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          userId={sessionMutation.data?.user?.id as string}
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

const CustomModal = ({
  isOpen,
  setIsOpen,
  userId,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  userId: string;
}) => {
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

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setIsOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-title"
                >
                  Delete account
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-text">
                    Are you sure you want to delete your account? All of your
                    data will be permanently removed. This action cannot be
                    undone.
                  </p>
                </div>
                <div className="mt-4 flex flex-col gap-3 xxs:flex-row xs:items-center">
                  <button
                    aria-label="proceed"
                    type="button"
                    className="inline-flex justify-center border border-transparent px-4 py-1.5 text-sm font-medium text-title ring-1 ring-red-500 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 enabled:hover:bg-red-200 disabled:cursor-not-allowed"
                    onClick={async () => {
                      await deleteUserMutation.mutateAsync(userId);
                      setIsOpen(false);
                    }}
                    disabled={deleteUserMutation.isLoading}
                  >
                    {deleteUserMutation.isLoading ? "Loading..." : "Proceed"}
                  </button>
                  <button
                    aria-label="cancel"
                    type="button"
                    className="inline-flex justify-center border border-transparent px-4 py-1.5 text-sm font-medium text-title ring-1 ring-blue-500 transition hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
