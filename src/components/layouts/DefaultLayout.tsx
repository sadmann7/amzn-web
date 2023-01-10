import { trpc } from "@/utils/trpc";
import { type ReactNode } from "react";

// coomponents imports
import Loader from "../Loader";
import Footer from "./Footer";
import Navbar from "./Navbar";

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  // trpc
  const productsQuery = trpc.products.getProducts.useQuery(undefined, {
    staleTime: 1000 * 60 * 60 * 24,
  });

  if (productsQuery.isLoading) {
    return <Loader />;
  }

  if (productsQuery.isError) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="flex flex-col gap-5">
          <div className="text-xl font-semibold text-title md:text-3xl">
            Error: {productsQuery.error.message}
          </div>
          <table>
            <thead className="text-sm font-medium text-text md:text-base">
              <tr>
                <th className="text-left">Try doing these:</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-text md:text-base">
              <tr>
                <td>1. Spine transfer to nosegrab frontflip</td>
              </tr>
              <tr>
                <td>2. Wall flip to natas spin</td>
              </tr>
              <tr>
                <td>3. Sticker slap to manual to wallplant</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
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
