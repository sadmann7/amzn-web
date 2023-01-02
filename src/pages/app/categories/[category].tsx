import type { Product } from "@/types/globals";
import { getProductsByCategory } from "@/utils/queryFns";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import Router from "next/router";
import type { NextPageWithLayout } from "../../_app";

// components imports
import DefaultLayout from "@/components/layouts/DefaultLayout";
import ProductList from "@/components/ProductList";

type CategoryNameProps = {
  products: Product[];
};

const CategoryName: NextPageWithLayout<CategoryNameProps> = (props) => {
  // tanstack/react-query
  const category = Router.query.category as string;
  const { data: products, status } = useQuery<Product[]>({
    queryKey: ["productsByCategory", category],
    queryFn: () => getProductsByCategory(category),
    initialData: props.products,
  });

  return (
    <>
      <Head>
        <title>Products | Amzn Store</title>
      </Head>
      <main className="pt-48 md:pt-40 lg:pt-36">
        <div className="mx-auto min-h-screen w-[95vw] max-w-screen-2xl">
          {status === "error" ? (
            <div className="text-center text-base text-title md:text-lg">
              Error in fetching product
            </div>
          ) : (
            <div className="text-center text-base text-title md:text-lg">
              <ProductList products={products} status={status} />
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default CategoryName;

CategoryName.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const category = ctx.query.category as string;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["productsByCategory", category],
    queryFn: () => getProductsByCategory(category),
  });
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
