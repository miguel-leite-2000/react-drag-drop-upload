import React from "react";
import { twMerge } from "tailwind-merge";

interface UploaderWrapperProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  disabled?: boolean;
  variant?: "large" | "small";
  uploaded?: boolean;
  error?: boolean;
}

interface HoverMessageProps extends React.HTMLAttributes<HTMLDivElement> {}

interface DescriptionWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  error: boolean;
}

interface DescriptionProps extends React.HTMLAttributes<HTMLSpanElement> {
  disabled: boolean | undefined;
  label?: string | React.ReactElement;
  description?: string | React.ReactElement;
  currFile: File | File[] | null;
  uploaded: boolean | undefined;
  types?: Array<string>;
  variant: "large" | "small";
  messageSuccess?: string;
}
export const UploadWrapper = React.forwardRef<
  HTMLLabelElement,
  UploaderWrapperProps
>(
  (
    {
      disabled = false,
      className,
      variant = "large",
      uploaded = false,
      children,
      error,
      ...props
    },
    ref
  ) => {
    const baseStyles = {
      large:
        "p-8 text-center relative border border-dashed border-zinc-500 bg-zinc-100 rounded-md cursor-pointer data-[disabled=true]:cursor-default data-[disabled=true]:bg-zinc-50 data-[disabled=true]:border-zinc-400 data-[uploaded=true]:border-green-500 data-[uploaded=true]:bg-green-700/20 data-[error=true]:border-red-500 data-[error=true]:bg-red-700/20 flex flex-col items-center gap-2 max-w-[445px] w-full max-h-[202px] h-auto",
      small:
        "px-8 relative py-5 border border-dashed border-zinc-500 bg-zinc-100 rounded-md cursor-pointer data-[disabled=true]:cursor-default data-[disabled=true]:bg-zinc-50 data-[disabled=true]:border-zinc-400 data-[uploaded=true]:border-green-500 data-[uploaded=true]:bg-green-700/20 data-[error=true]:border-red-500 data-[error=true]:bg-red-700/20 flex items-center gap-5 max-w-[531px] w-full max-h-[80px] h-full",
    };
    return (
      <label
        data-disabled={disabled}
        data-uploaded={uploaded}
        data-error={error}
        ref={ref}
        className={twMerge(baseStyles[variant], className)}
        {...props}
      >
        {children}
      </label>
    );
  }
);

export function HoverMessage({ className, ...props }: HoverMessageProps) {
  return (
    <div
      className={twMerge(
        "hover-msg z-50 text-zinc-100 font-semibold flex items-center justify-center border-zinc-700 rounded-md bg-purple-700/30 absolute top-0 right-0 left-0 bottom-0",
        className
      )}
      {...props}
    />
  );
}

export function DescriptionWrapper({
  className,
  ...props
}: DescriptionWrapperProps) {
  return (
    <div
      data-error={props.error}
      className={twMerge(
        "upload-description flex justify-between flex-1 text-xs data-[error=true]:text-red-700",
        className
      )}
      {...props}
    />
  );
}

export function Description({
  className,
  disabled,
  label,
  description,
  currFile,
  uploaded,
  types,
  variant,
  messageSuccess,
  ...props
}: DescriptionProps) {
  const baseStyles = {
    large:
      "description z-0 text-sm text-zinc-700 flex flex-col items-center gap-2",
    small:
      "description z-0 text-sm text-zinc-700 flex flex-col items-start gap-1",
  };
  const labelContent = label || (
    <React.Fragment>
      {" "}
      Drag & drop files or{" "}
      <span className="underline text-purple-600">Browse</span>{" "}
    </React.Fragment>
  );

  const descriptionContent = description || (
    <p>
      <span className="font-medium underline">Upload</span> or drop a file right
      here, upported formates: <DrawTypes types={types} />
    </p>
  );

  return (
    <span className={twMerge(baseStyles[variant], className)} {...props}>
      {disabled ? (
        <span>Upload disabled</span>
      ) : !currFile && !uploaded ? (
        <>
          <strong className="text-base font-bold text-zinc-700">
            {labelContent}
          </strong>
          {descriptionContent}
        </>
      ) : (
        <>
          <p
            data-uploaded={uploaded}
            className="data-[uploaded=true]:text-green-700"
          >
            {messageSuccess || "Uploaded Successfully! Upload another?"}
          </p>
        </>
      )}
    </span>
  );
}

interface DrawTypesProps {
  types?: Array<string>;
  minSize?: number;
  maxSize?: number;
}
/**
 * Draw the types and sizes restrictions for the uploading.
 * @param {Object} fileData file data types, minSize, maxSize
 * @returns JSX Element | null
 *
 * @internal
 */
export default function DrawTypes({
  types,
  minSize,
  maxSize,
}: DrawTypesProps): null | JSX.Element {
  if (types) {
    const stringTypes = types.toString();
    let size = "";
    if (maxSize) size += `size >= ${maxSize}, `;
    if (minSize) size += `size <= ${minSize}, `;
    return (
      <span title={`${size}types: ${stringTypes}`} className="file-types">
        {stringTypes.replace(",", ", ")}
      </span>
    );
  }
  return null;
}

interface DrawDescProps {
  currFile: Array<File> | File | null;
  uploaded: boolean;
  typeError: boolean;
  disabled: boolean | undefined;
  label?: string | React.ReactElement;
  description?: string | React.ReactElement;
  types?: Array<string>;
  variant: "large" | "small";
  messageError?: string;
  messageSuccess?: string;
}

export const DrawDesc = ({
  currFile,
  disabled,
  label,
  description,
  typeError,
  uploaded,
  types,
  variant,
  messageError,
  messageSuccess,
}: DrawDescProps) => {
  return typeError ? (
    <span className="message-error-type-or-size">
      {messageError || "File type/size error, Hovered on types!"}
    </span>
  ) : (
    <Description
      currFile={currFile}
      disabled={disabled}
      label={label || ""}
      description={description}
      uploaded={uploaded}
      types={types}
      variant={variant}
      messageSuccess={messageSuccess}
    />
  );
};
