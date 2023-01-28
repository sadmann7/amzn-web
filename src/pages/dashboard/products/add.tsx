import { formatEnum } from "@/utils/format";
import { trpc } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { PRODUCT_CATEGORY } from "@prisma/client";
import { useIsMutating } from "@tanstack/react-query";
import Head from "next/head";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import type { NextPageWithLayout } from "../../_app";

// imports: components
import Button from "@/components/Button";
import DefaultLayout from "@/layouts/DefaultLayout";

const schema = z.object({
  title: z.string().min(3),
  price: z.number().min(0),
  category: z.nativeEnum(PRODUCT_CATEGORY),
  description: z.string().min(3),
  image: z.string().url(),
  rating: z.number().min(0).max(5),
});
type Inputs = z.infer<typeof schema>;

const AddProduct: NextPageWithLayout = () => {
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
    await addProductMutation.mutateAsync({ ...data });
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
          <div className="grid gap-2">
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
              {...register("title", { required: true })}
            />
            {errors.title ? (
              <p className="text-sm font-medium text-danger">
                {errors.title.message}
              </p>
            ) : null}
          </div>
          <div className="grid gap-2">
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
          </div>
          <div className="grid gap-2">
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
          </div>
          <div className="grid gap-2">
            <label
              htmlFor="add-product-image"
              className="text-xs font-medium text-title md:text-sm"
            >
              Product image
            </label>
            <input
              type="text"
              id="add-product-image"
              className="w-full px-4 py-2.5 text-xs font-medium text-title transition-colors placeholder:text-lowkey/80 md:text-sm"
              placeholder="Product image"
              {...register("image", { required: true })}
            />
            {errors.image ? (
              <p className="text-sm font-medium text-danger">
                {errors.image.message}
              </p>
            ) : null}
          </div>
          <div className="grid gap-2">
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
          </div>
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
