import { trpc } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import type { NextPageWithLayout } from "../_app";

// external imports
import Button from "@/components/Button";
import DefaultLayout from "@/layouts/DefaultLayout";

const schema = z.object({
  image: z.any(),
});
type Inputs = z.infer<typeof schema>;

const Upload: NextPageWithLayout = () => {
  // upload image mutation
  const uploadImageMutation = trpc.admin.products.uploadImage.useMutation({
    onSuccess: async () => {
      toast.success("Image uploaded!");
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
    const reader = new FileReader();
    reader.readAsDataURL(data.image[0]);
    reader.onload = () => {
      const base64 = reader.result;
      uploadImageMutation.mutateAsync(base64 as string);
    };
  };

  return (
    <>
      <Head>
        <title>Upload | Amzn Store</title>
      </Head>
      <main className="mx-auto min-h-screen w-full max-w-[200px] pt-52 pb-14 sm:w-[95vw] md:pt-40">
        <form
          aria-label="upload image form"
          className="grid gap-2.5 whitespace-nowrap"
          onSubmit={handleSubmit(onSubmit)}
        >
          <fieldset className="grid gap-2">
            <label
              htmlFor="upload-image"
              className="text-xs font-medium text-title md:text-sm"
            >
              Product title
            </label>
            <input
              type="file"
              id="upload-image"
              className="w-full px-4 py-2.5 text-xs font-medium text-title transition-colors placeholder:text-lowkey/80 md:text-sm"
              placeholder="Product title"
              {...register("image", { required: true })}
            />
            {errors.image ? (
              <p className="text-sm font-medium text-danger">
                {errors.image.message as string}
              </p>
            ) : null}
          </fieldset>
          <Button aria-label="upload photo" className="w-full">
            Upload
          </Button>
        </form>
      </main>
    </>
  );
};

export default Upload;

Upload.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
