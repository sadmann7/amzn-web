import { formatEnum } from "@/utils/format";
import { trpc } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { PRODUCT_CATEGORY } from "@prisma/client";
import { useIsMutating } from "@tanstack/react-query";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import type { NextPageWithLayout } from "../../_app";

// external imports
import Button from "@/components/Button";
import DefaultLayout from "@/layouts/DefaultLayout";
import Image from "next/image";

const schema = z.object({
  name: z.string().min(3),
  price: z.number().min(0),
  category: z.nativeEnum(PRODUCT_CATEGORY),
  description: z.string().min(3),
  image: z.any(),
  rating: z.number().min(0).max(5),
});
type Inputs = z.infer<typeof schema>;

const AddProduct: NextPageWithLayout = () => {
  const [imageBuffer, setImageBuffer] = useState<string>();

  // react-dropzone
  const [preview, setPreview] = useState<string>();
  const onDrop = useCallback(
    (acceptedFiles: File[]) =>
      acceptedFiles.forEach((file) => {
        setPreview(URL.createObjectURL(file));
      }),
    []
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: onDrop,
  });

  console.log(preview);

  // add product mutation
  const addProductMutation = trpc.admin.products.createProduct.useMutation({
    onSuccess: async () => {
      toast.success("Product added!");
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
    const reader = new FileReader();
    reader.readAsDataURL(data.image[0]);
    reader.onload = () => {
      const base64 = reader.result;
      setImageBuffer(base64 as string);
    };
    if (!imageBuffer) return toast.error("Image not uploaded!");
    await addProductMutation.mutateAsync({ ...data, image: imageBuffer });
    reset();
  };

  // refetch products query
  const uitls = trpc.useContext();
  const number = useIsMutating();
  useEffect(() => {
    if (number === 0) {
      uitls.products.getProducts.invalidate();
    }
  }, [number, uitls]);

  return (
    <>
      <Head>
        <title>Add Product | Amzn Store</title>
      </Head>
      <main className="mx-auto min-h-screen w-full max-w-screen-sm px-4 pt-52 pb-14 sm:w-[95vw] md:pt-40">
        <form
          aria-label="add product form"
          className="grid gap-2.5 whitespace-nowrap"
          onSubmit={handleSubmit(onSubmit)}
        >
          <fieldset className="grid gap-2">
            <label
              htmlFor="add-product-title"
              className="text-xs font-medium text-title md:text-sm"
            >
              Product title
            </label>
            <input
              type="text"
              id="add-product-title"
              className="w-full px-4 py-2.5 text-xs font-medium text-title transition-colors placeholder:text-lowkey/80 md:text-sm"
              placeholder="Product title"
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
            <input
              type="text"
              id="add-product-description"
              className="w-full px-4 py-2.5 text-xs font-medium text-title transition-colors placeholder:text-lowkey/80 md:text-sm"
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
            <input
              type="file"
              id="add-product-image"
              className="w-full px-4 py-2.5 text-xs font-medium text-title transition-colors placeholder:text-lowkey/80 md:text-sm"
              placeholder="Product image"
              {...register("image", { required: true })}
            />
            {errors.image ? (
              <p className="text-sm font-medium text-danger">
                {errors.image.message as string}
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
            <div
              {...getRootProps()}
              className="w-full px-4 py-2.5 text-xs font-medium text-title ring-1 ring-lowkey/80 transition-colors placeholder:text-lowkey/80 md:text-sm"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : preview ? (
                <Image
                  src={preview}
                  alt="product preview"
                  width={320}
                  height={320}
                  className="h-40 w-full object-cover"
                />
              ) : (
                <p>
                  Drag {`'n'`} drop some files here, or click to select files
                </p>
              )}
            </div>
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
      </main>
    </>
  );
};

export default AddProduct;

AddProduct.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
