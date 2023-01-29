import DefaultLayout from "@/layouts/DefaultLayout";
import { formatEnum } from "@/utils/format";
import { trpc } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { PRODUCT_CATEGORY } from "@prisma/client";
import { useIsMutating } from "@tanstack/react-query";
import Head from "next/head";
import Router from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import type { NextPageWithLayout } from "../../_app";

// external imports
import Button from "@/components/Button";
import ErrorScreen from "@/screens/ErrorScreen";
import LoadingScreen from "@/screens/LoadingScreen";
import Image from "next/image";

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
type Inputs = z.infer<typeof schema> & { image: File };

const UpdateProduct: NextPageWithLayout = () => {
  const productId = Router.query.productId as string;
  const utils = trpc.useContext();
  const [preview, setPreview] = useState<string | null>();

  // get product query
  const getProductQuery = trpc.admin.products.getProduct.useQuery(productId, {
    enabled: Boolean(productId),
  });

  // update product mutation
  const updateProductMutation = trpc.admin.products.update.useMutation({
    onSuccess: async () => {
      toast.success("Product updated!");
    },
    onError: async (err) => {
      toast.error(err.message);
    },
  });

  // delete product mutation
  const deleteProductMutation = trpc.admin.products.delete.useMutation({
    onSuccess: async () => {
      toast.success("Product deleted!");
      Router.push("/dashboard/products");
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
  } = useForm<Inputs>({ resolver: zodResolver(schema) });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const reader = new FileReader();
    reader.readAsDataURL(data.image);
    reader.onload = async () => {
      const base64 = reader.result;
      await updateProductMutation.mutateAsync({
        id: productId,
        ...data,
        image: base64 as string,
      });
    };
  };

  // react-dropzone
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) =>
      acceptedFiles.forEach(
        (file) => {
          if (!file) return;
          setPreview(URL.createObjectURL(file));
          setValue("image", file, {
            shouldValidate: true,
          });
        },
        rejectedFiles.forEach((file) => {
          if (file.errors[0]?.code === "file-too-large") {
            const size = Math.round(file.file.size / 1000000);
            toast.error(
              `Please upload a image smaller than 1MB. Current size: ${size}MB`
            );
          } else {
            toast.error(toast.error(file.errors[0]?.message));
          }
        })
      ),

    [setValue]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxSize: 1000000,
    onDrop: onDrop,
  });

  // refetch product query
  const number = useIsMutating();
  useEffect(() => {
    if (number === 0) {
      utils.admin.products.getProduct.invalidate(productId);
      utils.products.getProducts.invalidate();
    }
  }, [number, productId, utils]);

  if (getProductQuery.isLoading) {
    return <LoadingScreen />;
  }

  if (getProductQuery.isError) {
    return <ErrorScreen />;
  }

  return (
    <>
      <Head>
        <title>Update Product | Amzn Store</title>
      </Head>
      <main className="mx-auto min-h-screen w-full max-w-screen-sm px-4 pt-52 pb-14 sm:w-[95vw] md:pt-40">
        <div className="grid gap-4">
          <form
            aria-label="update product form"
            className="grid gap-2.5 whitespace-nowrap"
            onSubmit={handleSubmit(onSubmit)}
          >
            <fieldset className="grid gap-2">
              <label
                htmlFor="update-product-title"
                className="text-xs font-medium text-title md:text-sm"
              >
                Product title
              </label>
              <input
                type="text"
                id="update-product-title"
                className="w-full px-4 py-2.5 text-xs font-medium text-title transition-colors placeholder:text-lowkey/80 md:text-sm"
                placeholder="Product title"
                {...register("name", { required: true })}
                defaultValue={getProductQuery.data?.name}
              />
              {errors.name ? (
                <p className="text-sm font-medium text-danger">
                  {errors.name.message}
                </p>
              ) : null}
            </fieldset>
            <fieldset className="grid gap-2">
              <label
                htmlFor="update-product-price"
                className="text-xs font-medium text-title md:text-sm"
              >
                Product price
              </label>
              <input
                type="number"
                step="any"
                id="update-product-price"
                className="w-full px-4 py-2.5 text-xs font-medium text-title transition-colors placeholder:text-lowkey/80 md:text-sm"
                placeholder="Product price"
                {...register("price", {
                  required: true,
                  valueAsNumber: true,
                })}
                defaultValue={getProductQuery.data?.price}
              />
              {errors.price ? (
                <p className="text-sm font-medium text-danger">
                  {errors.price.message}
                </p>
              ) : null}
            </fieldset>
            <fieldset className="grid gap-2">
              <label
                htmlFor="update-product-category"
                className="text-xs font-medium text-title md:text-sm"
              >
                Product category
              </label>
              <select
                id="update-product-category"
                className="w-full px-4 py-2.5 text-xs font-medium text-title transition-colors md:text-sm"
                {...register("category", { required: true })}
                defaultValue={getProductQuery.data?.category}
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
                id="update-product-description"
                className="h-32 w-full px-4 py-2.5 text-xs font-medium text-title transition-colors placeholder:text-lowkey/80 md:text-sm"
                placeholder="Product description"
                {...register("description", { required: true })}
                defaultValue={getProductQuery.data?.description}
              />
              {errors.description ? (
                <p className="text-sm font-medium text-danger">
                  {errors.description.message}
                </p>
              ) : null}
            </fieldset>
            <fieldset className="grid gap-2">
              <label
                htmlFor="update-product-image"
                className="text-xs font-medium text-title md:text-sm"
              >
                Product image
              </label>
              <div
                {...getRootProps()}
                className="grid h-32 w-full place-items-center p-2 text-xs font-medium text-title ring-1 ring-lowkey/80 transition-colors placeholder:text-lowkey/80 md:text-sm"
              >
                <input {...getInputProps()} id="update-product-image" />
                {isDragActive ? (
                  <p>Drop the files here ...</p>
                ) : preview ?? getProductQuery.data?.image ? (
                  <Image
                    src={preview ?? (getProductQuery.data?.image as string)}
                    alt="product preview"
                    width={224}
                    height={224}
                    className="h-28 w-full object-cover"
                  />
                ) : (
                  <p>Drag {`'n'`} drop image here, or click to select image</p>
                )}
              </div>
              {errors.image ? (
                <p className="text-sm font-medium text-danger">
                  {errors.image.message}
                </p>
              ) : null}
            </fieldset>
            <fieldset className="grid gap-2">
              <label
                htmlFor="update-product-rating"
                className="text-xs font-medium text-title md:text-sm"
              >
                Product ratings
              </label>
              <input
                type="number"
                step="any"
                id="update-product-rating"
                className="w-full px-4 py-2.5 text-xs font-medium text-title transition-colors placeholder:text-lowkey/80 md:text-sm"
                placeholder="Product ratings"
                {...register("rating", { required: true, valueAsNumber: true })}
                defaultValue={getProductQuery.data?.rating}
              />
              {errors.rating ? (
                <p className="text-sm font-medium text-danger">
                  {errors.rating.message}
                </p>
              ) : null}
            </fieldset>
            <Button
              aria-label="update product"
              className="w-full"
              disabled={updateProductMutation.isLoading}
            >
              {updateProductMutation.isLoading
                ? "Loading..."
                : "Update product"}
            </Button>
          </form>
          <Button
            aria-label="delete product"
            className="w-full bg-danger"
            onClick={() => deleteProductMutation.mutateAsync(productId)}
            disabled={deleteProductMutation.isLoading}
          >
            {deleteProductMutation.isLoading ? "Loading..." : "Delete product"}
          </Button>
        </div>
      </main>
    </>
  );
};

export default UpdateProduct;

UpdateProduct.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
