import type { Product } from "@/types/globals";
import { getProduct } from "@/utils/queryFns";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import Router from "next/router";
import type { NextPageWithLayout } from "../../_app";

// components imports
import DefaultLayout from "@/components/layouts/DefaultLayout";

type ProductIdProps = {
  product: Product;
};

const ProductId: NextPageWithLayout<ProductIdProps> = (props) => {
  const productId = Number(Router.query.productId);
  const { data: product, status } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProduct(productId),
    initialData: props.product,
  });

  return (
    <>
      <Head>
        <title>Product | Amzn Store</title>
      </Head>
      <main className="pt-40 md:pt-32 lg:pt-[6.7rem]">
        <div className="mx-auto min-h-screen w-[95vw] max-w-screen-2xl">
          {status === "error" ? (
            <div className="text-center text-base text-title md:text-lg">
              Error
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

export default ProductId;

ProductId.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;

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
