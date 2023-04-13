import { formatEnum } from "@/utils/format";
import { trpc } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { PRODUCT_CATEGORY } from "@prisma/client";
import { useIsMutating } from "@tanstack/react-query";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import type { NextPageWithLayout } from "../../_app";

// external imports
import Button from "@/components/ui/Button";
import CustomDropzone from "@/components/ui/FileInput";
import DefaultLayout from "@/components/layouts/DefaultLayout";

const schema = z.object({
  name: z.string().min(3),
  price: z.number().min(0),
  category: z.nativeEnum(PRODUCT_CATEGORY),
  description: z.string().min(3),
  image: z.unknown().refine((v) => v instanceof File, {
    message: "Expected File, received unknown",
  }),
  rating: z.number().min(0).max(5),
});
type Inputs = z.infer<typeof schema>;

const AddProduct: NextPageWithLayout = () => {
  const [preview, setPreview] = useState<string | undefined>();

  // add product mutation
  const addProductMutation = trpc.admin.products.create.useMutation({
    onSuccess: async () => {
      toast.success("Product added!");
      reset();
      setPreview(undefined);
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
    setValue,
    reset,
  } = useForm<Inputs>({ resolver: zodResolver(schema) });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const reader = new FileReader();
    reader.readAsDataURL(data.image as File);
    reader.onload = async () => {
      const base64 = reader.result;
      await addProductMutation.mutateAsync({
        ...data,
        image: base64 as string,
      });
    };
  };

  // refetch products query
  const uitls = trpc.useContext();
  const number = useIsMutating();
  useEffect(() => {
    if (number === 0) {
      uitls.products.get.invalidate();
    }
  }, [number, uitls]);

  return (
    <>
      <Head>
        <title>Add Product | Amzn Store</title>
      </Head>
      <main className="min-h-screen pb-14 pt-52 md:pt-40">
        <div className="mx-auto w-full max-w-screen-sm px-4 sm:w-[95vw]">
          <form
            aria-label="add product form"
            className="grid gap-2.5 whitespace-nowrap"
            onSubmit={handleSubmit(onSubmit)}
          >
            <fieldset className="grid gap-2">
              <label
                htmlFor="add-product-name"
                className="text-xs font-medium text-title md:text-sm"
              >
                Product name
              </label>
              <input
                type="text"
                id="add-product-name"
                className="w-full px-4 py-2.5 text-xs font-medium text-title transition-colors placeholder:text-lowkey/80 md:text-sm"
                placeholder="Product name"
                {...register("name", { required: true })}
              />
              {errors.name ? (
                <p className="text-sm font-medium text-danger">
                  {errors.name.message}
                </p>
              ) : null}
            </fieldset>
            <fieldset className="grid gap-2">
              <label
                htmlFor="add-product-price"
                className="text-xs font-medium text-title md:text-sm"
              >
                Product price
              </label>
              <input
                type="number"
                step="any"
                id="add-product-price"
                className="w-full px-4 py-2.5 text-xs font-medium text-title transition-colors placeholder:text-lowkey/80 md:text-sm"
                placeholder="Product price"
                {...register("price", {
                  required: true,
                  valueAsNumber: true,
                })}
              />
              {errors.price ? (
                <p className="text-sm font-medium text-danger">
                  {errors.price.message}
                </p>
              ) : null}
            </fieldset>
            <fieldset className="grid gap-2">
              <label
                htmlFor="add-product-category"
                className="text-xs font-medium text-title md:text-sm"
              >
                Product category
              </label>
              <select
                id="add-product-category"
                className="w-full px-4 py-2.5 text-xs font-medium text-title transition-colors md:text-sm"
                {...register("category", { required: true })}
              >
                <option value="" hidden>
                  Select category
                </option>
                {Object.values(PRODUCT_CATEGORY).map((category) => (
                  <option key={category} value={category}>
                    {formatEnum(category)}
                  </option>
                ))}
              </select>
              {errors.category ? (
                <p className="text-sm font-medium text-danger">
                  {errors.category.message}
                </p>
              ) : null}
            </fieldset>
            <fieldset className="grid gap-2">
              <label
                htmlFor="update-user-name"
                className="text-xs font-medium text-title md:text-sm"
              >
                Product description
              </label>
              <textarea
                cols={25}
                rows={5}
                id="add-product-description"
                className="h-32 w-full px-4 py-2.5 text-xs font-medium text-title transition-colors placeholder:text-lowkey/80 md:text-sm"
                placeholder="Product description"
                {...register("description", { required: true })}
              />
              {errors.description ? (
                <p className="text-sm font-medium text-danger">
                  {errors.description.message}
                </p>
              ) : null}
            </fieldset>
            <fieldset className="grid gap-2">
              <label
                htmlFor="add-product-image"
                className="text-xs font-medium text-title md:text-sm"
              >
                Product image
              </label>
              <CustomDropzone<Inputs>
                id="add-product-image"
                name="image"
                setValue={setValue}
                preview={preview}
                setPreview={setPreview}
              />
              {errors.image ? (
                <p className="text-sm font-medium text-danger">
                  {errors.image.message}
                </p>
              ) : null}
            </fieldset>
            <fieldset className="grid gap-2">
              <label
                htmlFor="add-product-rating"
                className="text-xs font-medium text-title md:text-sm"
              >
                Product ratings
              </label>
              <input
                type="number"
                step="any"
                id="add-product-rating"
                className="w-full px-4 py-2.5 text-xs font-medium text-title transition-colors placeholder:text-lowkey/80 md:text-sm"
                placeholder="Product ratings"
                {...register("rating", { required: true, valueAsNumber: true })}
              />
              {errors.rating ? (
                <p className="text-sm font-medium text-danger">
                  {errors.rating.message}
                </p>
              ) : null}
            </fieldset>
            <Button
              aria-label="add product"
              className="w-full"
              disabled={addProductMutation.isLoading}
            >
              {addProductMutation.isLoading ? "Loading..." : "Add product"}
            </Button>
          </form>
        </div>
      </main>
    </>
  );
};

export default AddProduct;

AddProduct.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
