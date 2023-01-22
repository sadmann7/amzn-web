import DefaultLayout from "@/components/layouts/DefaultLayout";
import { formatEnum } from "@/utils/format";
import { trpc } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { PRODUCT_CATEGORY } from "@prisma/client";
import { useIsMutating } from "@tanstack/react-query";
import Head from "next/head";
import Router from "next/router";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import type { NextPageWithLayout } from "../../_app";

// imports: components
import Button from "@/components/Button";
import ErrorScreen from "@/components/screens/ErrorScreen";
import LoadingScreen from "@/components/screens/LoadingScreen";

const schema = z.object({
  title: z.string().min(3),
  price: z.number().min(0),
  category: z.nativeEnum(PRODUCT_CATEGORY),
  description: z.string().min(3),
  image: z.string().url(),
  rating: z.number().min(0).max(5),
});
type Inputs = z.infer<typeof schema>;

const UpdateProduct: NextPageWithLayout = () => {
  const productId = Number(Router.query.productId);
  const utils = trpc.useContext();

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
  } = useForm<Inputs>({ resolver: zodResolver(schema) });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await updateProductMutation.mutateAsync({
      id: productId,
      ...data,
    });
  };
  // refetch product query
  const number = useIsMutating();
  useEffect(() => {
    if (number === 0) {
      utils.admin.products.getProduct.invalidate(productId);
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
            <div className="grid gap-2">
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
                {...register("title", { required: true })}
                defaultValue={getProductQuery.data?.title}
              />
              {errors.title ? (
                <p className="text-sm font-medium text-danger">
                  {errors.title.message}
                </p>
              ) : null}
            </div>
            <div className="grid gap-2">
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
            </div>
            <div className="grid gap-2">
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
            </div>
            <div className="grid gap-2">
              <label
                htmlFor="update-user-name"
                className="text-xs font-medium text-title md:text-sm"
              >
                Product description
              </label>
              <input
                type="text"
                id="update-product-description"
                className="w-full px-4 py-2.5 text-xs font-medium text-title transition-colors placeholder:text-lowkey/80 md:text-sm"
                placeholder="Product description"
                {...register("description", { required: true })}
                defaultValue={getProductQuery.data?.description}
              />
              {errors.description ? (
                <p className="text-sm font-medium text-danger">
                  {errors.description.message}
                </p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <label
                htmlFor="update-product-image"
                className="text-xs font-medium text-title md:text-sm"
              >
                Product image
              </label>
              <input
                type="text"
                id="update-product-image"
                className="w-full px-4 py-2.5 text-xs font-medium text-title transition-colors placeholder:text-lowkey/80 md:text-sm"
                placeholder="Product image"
                {...register("image", { required: true })}
                defaultValue={getProductQuery.data?.image}
              />
              {errors.image ? (
                <p className="text-sm font-medium text-danger">
                  {errors.image.message}
                </p>
              ) : null}
            </div>
            <div className="grid gap-2">
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
            </div>
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
