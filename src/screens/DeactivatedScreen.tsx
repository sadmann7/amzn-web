// external imports
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

const DeactivatedScreen = () => {
  return (
    <div className="mx-auto flex min-h-screen max-w-screen-sm flex-col items-center justify-center gap-4 px-4">
      <ExclamationCircleIcon className="aspect-square w-24 text-danger md:w-28" />
      <h1 className="text-center text-2xl font-bold text-title md:text-3xl">
        Your account has been deactivated
      </h1>
      <p className="text-center text-base font-medium text-lowkey md:text-lg">
        Please contact the administrator to reactivate your account. If you are
        the administrator, please check the logs for more information.
      </p>
    </div>
  );
};

export default DeactivatedScreen;
