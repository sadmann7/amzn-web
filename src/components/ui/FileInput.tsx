import Image from "next/image";
import {
  useCallback,
  useEffect,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import type {
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
} from "react-hook-form";
import { toast } from "react-hot-toast";

interface DropProps<TInputs extends FieldValues>
  extends React.HTMLAttributes<HTMLDivElement> {
  name: Path<TInputs>;
  setValue: UseFormSetValue<TInputs>;
  preview: string | undefined;
  setPreview: Dispatch<SetStateAction<string | undefined>>;
}

const FileInput = <TInputs extends FieldValues>({
  name,
  setValue,
  preview,
  setPreview,
  className,
  id,
}: DropProps<TInputs>) => {
  // react-dropzone
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) =>
      acceptedFiles.forEach(
        (file) => {
          if (!file) return;
          setValue(name, file as PathValue<TInputs, Path<TInputs>>, {
            shouldValidate: true,
          });
          setPreview(URL.createObjectURL(file));
        },
        rejectedFiles.forEach((file) => {
          if (file.errors[0]?.code === "file-too-large") {
            const size = Math.round(file.file.size / 1000000);
            toast.error(
              `Please upload a image smaller than 1MB. Current size: ${size}MB`
            );
          } else {
            toast.error(toast.error(file.errors[0]?.message ?? "Error"));
          }
        })
      ),

    [name, setPreview, setValue]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxSize: 1000000,
    onDrop: onDrop,
  });

  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  return (
    <div
      {...getRootProps()}
      className={`grid h-32 w-full place-items-center p-2 text-xs font-medium text-title ring-1 ring-lowkey/80 transition-colors placeholder:text-lowkey/80 md:text-sm ${className}`}
      id={id}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : preview ? (
        <Image
          src={preview}
          alt="product preview"
          width={224}
          height={224}
          className="h-28 w-full object-cover"
          priority
          onLoad={() => URL.revokeObjectURL(preview)}
        />
      ) : (
        <p>Drag {`'n'`} drop image here, or click to select image</p>
      )}
    </div>
  );
};

export default FileInput;
