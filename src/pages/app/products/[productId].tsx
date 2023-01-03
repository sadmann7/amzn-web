import type { Product } from "@/types/globals";
import { getProduct } from "@/utils/queryFns";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import Router from "next/router";
import type { NextPageWithLayout } from "../../_app";

// components imports
import DefaultLayout from "@/components/layouts/DefaultLayout";

type ShowProductProps = {
  product: Product;
};

const ShowProduct: NextPageWithLayout<ShowProductProps> = (props) => {
  // tanstack/react-query
  const productId = Number(Router.query.productId);
  const { data: product, status } = useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: () => getProduct(productId),
    initialData: props.product,
  });

  return (
    <>
      <Head>
        <title>{product.title ?? "Product"} | Amzn Store</title>
      </Head>
      <main className="min-h-screen pt-48 md:pt-40 lg:pt-36">
        <div className="mx-auto w-full max-w-screen-2xl px-2 sm:w-[95vw]">
          {status === "error" ? (
            <div className="text-center text-base text-title md:text-lg">
              Error in fetching product
            </div>
          ) : (
            <div className="text-center text-base text-title md:text-lg">
              {product.title}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default ShowProduct;

ShowProduct.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const productId = Number(ctx.query.productId);
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["product", productId],
    queryFn: () => getProduct(productId),
  });
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
