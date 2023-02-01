import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const Button = ({ children, className, ...btnProps }: ButtonProps) => {
  return (
    <button
      className={`w-fit bg-primary px-4 py-1.5 text-xs font-semibold text-title transition-opacity focus:outline-none enabled:hover:bg-opacity-80 enabled:active:bg-opacity-90 disabled:cursor-not-allowed sm:text-sm ${className}`}
      {...btnProps}
    >
      {children}
    </button>
  );
};

export default Button;
