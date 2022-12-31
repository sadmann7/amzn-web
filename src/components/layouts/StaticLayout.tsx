import type { ReactNode } from "react";

// coomponents imports
import Footer from "./Footer";
import Navbar from "./Navbar";

const StaticLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default StaticLayout;
