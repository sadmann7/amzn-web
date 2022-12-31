import React from "react";
import dayjs from "dayjs";

const Footer = () => {
  return (
    <footer>
      <div
        className="w-full cursor-pointer bg-layout-light py-3.5 text-center text-xs font-medium text-white transition-opacity hover:bg-opacity-90 md:text-sm"
        onClick={() => window.scrollTo(0, 0)}
      >
        Back to top
      </div>
      <div className="w-full bg-layout py-4 text-center text-sm text-white md:text-base">
        Copyright &#169; {dayjs().format("YYYY")} Amzn Store
      </div>
    </footer>
  );
};

export default Footer;
