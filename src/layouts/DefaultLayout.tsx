import DeactivatedScreen from "@/screens/DeactivatedScreen";
import ErrorScreen from "@/screens/ErrorScreen";
import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";
import { type ReactNode } from "react";

// external imports
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import LoadingScreen from "../screens/LoadingScreen";

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();

  // get products query
  const productsQuery = trpc.products.get.useQuery(undefined, {
    staleTime: 1000 * 60 * 60 * 24,
  });

  if (productsQuery.isLoading) {
    return <LoadingScreen />;
  }

  if (productsQuery.isError) {
    return <ErrorScreen error={productsQuery.error} />;
  }

  if (status === "authenticated" && !session?.user?.active) {
    return <DeactivatedScreen />;
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
