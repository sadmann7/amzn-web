import ErrorScreen from "@/screens/ErrorScreen";
import { trpc } from "@/utils/trpc";
import { type ReactNode } from "react";

// external imports
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Loader from "../screens/LoadingScreen";

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  // get products query
  const productsQuery = trpc.products.get.useQuery(undefined, {
    staleTime: 1000 * 60 * 60 * 24,
  });

  if (productsQuery.isLoading) {
    return <Loader />;
  }

  if (productsQuery.isError) {
    return <ErrorScreen error={productsQuery.error} />;
  }

  return (
    <>
      <Navbar data={productsQuery.data} />
      {children}
      <Footer />
    </>
  );
};

export default DefaultLayout;
