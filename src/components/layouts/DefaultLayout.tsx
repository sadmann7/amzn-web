import { useSession } from "next-auth/react";
import Router from "next/router";
import { type ReactNode, useEffect } from "react";

// coomponents imports
import Loader from "../Loader";
import Footer from "./Footer";
import Navbar from "./Navbar";

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      Router.push("/");
    }
  }, [status]);

  if (status === "loading") {
    return <Loader />;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default DefaultLayout;
