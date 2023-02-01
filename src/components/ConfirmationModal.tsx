import { Dialog, Transition } from "@headlessui/react";
import type { Dispatch, MouseEventHandler, SetStateAction } from "react";
import { Fragment } from "react";

type ConfirmationModalProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  name: string;
  description: string;
  onConfirm: MouseEventHandler<HTMLButtonElement> | undefined;
  isLoading?: boolean;
};

const ConfirmationModal = ({
  isOpen,
  setIsOpen,
  name,
  description,
  onConfirm,
  isLoading,
}: ConfirmationModalProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setIsOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-title"
                >
                  {name}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-text">{description}</p>
                </div>
                <div className="mt-4 flex flex-col gap-3 xxs:flex-row xs:items-center">
                  <button
                    aria-label="proceed"
                    type="button"
                    className="inline-flex justify-center border border-transparent px-4 py-1.5 text-sm font-medium text-title ring-1 ring-red-500 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 enabled:hover:bg-red-200 disabled:cursor-not-allowed"
                    onClick={onConfirm}
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Proceed"}
                  </button>
                  <button
                    aria-label="cancel"
                    type="button"
                    className="inline-flex justify-center border border-transparent px-4 py-1.5 text-sm font-medium text-title ring-1 ring-blue-500 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 enabled:hover:bg-blue-200 disabled:cursor-not-allowed"
                    onClick={() => setIsOpen(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ConfirmationModal;
