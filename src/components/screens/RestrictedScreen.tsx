import Router from "next/router";

// external imports
import Button from "@/components/ui/Button";
import { NoSymbolIcon } from "@heroicons/react/20/solid";

const RestrictedScreen = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 ">
      <NoSymbolIcon className="aspect-square w-24 text-danger md:w-28" />
      <h1 className="text-center text-2xl font-bold text-title md:text-3xl">
        Restricted
      </h1>
      <p className="text-center text-base text-text md:text-lg">
        You are not authorized to view this page.
      </p>
      <Button
        aria-label="navigate back"
        className="mt-2.5"
        onClick={() => Router.back()}
      >
        Go back
      </Button>
    </div>
  );
};

export default RestrictedScreen;
