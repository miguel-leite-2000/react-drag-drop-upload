import React from "react";
import { twMerge } from "tailwind-merge";

type UploaderWrapperProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  disabled?: boolean;
};

type HoverMessageProps = React.HTMLAttributes<HTMLDivElement>;

type DescriptionWrapperProps = React.HTMLAttributes<HTMLDivElement> & {
  error: boolean;
};

type DescriptionProps = React.HTMLAttributes<HTMLSpanElement> & {
  disabled: boolean | undefined;
  label: string | undefined;
  currFile: File | File[] | null;
  uploaded: boolean | undefined;
};

export const UploadWrapper = React.forwardRef<
  HTMLLabelElement,
  UploaderWrapperProps
>(({ disabled = false, className, children, ...props }, ref) => {
  const baseStyle = `flex items-center min-w-322 max-w-508 h-48 border-dashed border-2 border-blue-500 p-2 md:p-4 
  rounded cursor-pointer flex-grow-0 data-[disabled=true]:border-[2px] data-[disabled=true]:border-zinc-700`;
  return (
    <label
      data-disabled={disabled}
      ref={ref}
      className={twMerge(baseStyle, className)}
      {...props}
    >
      {children}
    </label>
  );
});

export function HoverMessage({ className, ...props }: HoverMessageProps) {
  return (
    <div
      className={twMerge(
        "hover-msg border-[2px] border-dashed border-zinc-700 rounded-md bg-zinc-500 opacity-30 absolute top-0 right-0 left-0 bottom-0",
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
  currFile,
  uploaded,
  ...props
}: DescriptionProps) {
  return (
    <span
      className={twMerge("description text-sm text-zinc-700", className)}
      {...props}
    >
      {disabled ? (
        <span>Upload disabled</span>
      ) : !currFile && !uploaded ? (
        <>
          {label ? (
            <>
              <span>{label.split(" ")[0]}</span>{" "}
              {label.substr(label.indexOf(" ") + 1)}
            </>
          ) : (
            <>
              <span>Upload</span> or drop a file right here
            </>
          )}
        </>
      ) : (
        <>
          <span>Uploaded Successfully!</span> Upload another?
        </>
      )}
    </span>
  );
}

type DrawTypesProps = {
  types?: Array<string>;
  minSize?: number;
  maxSize?: number;
};
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
        {stringTypes}
      </span>
    );
  }
  return null;
}
