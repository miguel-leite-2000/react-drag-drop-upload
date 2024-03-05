import React, { ReactNode, useEffect, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

import { acceptedExt, checkType, getFileSizeMB } from "../../utils";
import useDragging from "../../hooks/use-dragging";
import { twMerge } from "tailwind-merge";

export interface DrawTypesProps {
  types?: Array<string>;
  minSize?: number;
  maxSize?: number;
}

export interface DescriptionWrapperProps
  extends React.HTMLAttributes<HTMLDivElement> {
  error: boolean;
  unstyled?: boolean;
}
export interface DescriptionProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  disabled: boolean | undefined;
  label?: string | React.ReactElement;
  description?: string | React.ReactElement;
  currFile: File | File[] | null;
  uploaded: boolean | undefined;
  types?: Array<string>;
  variant: "large" | "small";
  messageSuccess?: string;
  unstyled?: boolean;
}

export interface UploaderWrapperProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  disabled?: boolean;
  variant?: "large" | "small";
  uploaded?: boolean;
  error?: boolean;
  unstyled?: boolean;
}

export interface HoverMessageProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export interface DescriptionWrapperProps
  extends React.HTMLAttributes<HTMLDivElement> {
  error: boolean;
}

export interface ChildrenUploaderProps {
  dragging: boolean;
  error: boolean;
  currFiles: File[] | File | null;
  types: Array<string> | undefined;
  minSize: number | undefined;
  maxSize: number | undefined;
  uploaded: boolean;
  label?: string | React.ReactElement;
  description?: string | React.ReactElement;
  disabled: boolean | undefined;
}

export interface ReactDragDropUploadProps {
  name?: string;
  messageSuccess?: string;
  messageError?: string;
  variant?: "large" | "small";
  hoverTitle?: string;
  types?: Array<string>;
  className?: string | undefined;
  children?: (props: ChildrenUploaderProps) => ReactNode | ReactNode;
  maxSize?: number;
  minSize?: number;
  fileOrFiles?: Array<File> | File | null;
  disabled?: boolean | false;
  label?: string | React.ReactElement;
  description?: string | React.ReactElement;
  multiple?: boolean | false;
  required?: boolean | false;
  onSizeError?: (arg: string) => void;
  onTypeError?: (arg: string) => void;
  onDrop?: (arg: File | Array<File>) => void;
  onSelect?: (arg: File | Array<File>) => void;
  handleChange?: (arg: File | Array<File> | File) => void;
  onDraggingStateChange?: (dragging: boolean) => void;
  unstyled?: boolean;
}

const DragDropUpload: React.FC<ReactDragDropUploadProps> = (
  props: ReactDragDropUploadProps
): JSX.Element => {
  const {
    name,
    hoverTitle,
    types,
    handleChange,
    className,
    children,
    maxSize,
    minSize,
    fileOrFiles,
    onSizeError,
    onTypeError,
    onSelect,
    onDrop,
    disabled,
    label,
    multiple,
    required,
    onDraggingStateChange,
    unstyled = false,
    messageError,
    messageSuccess,
    description,
    variant = "large",
  } = props;
  const labelRef = useRef<HTMLLabelElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploaded, setUploaded] = useState(false);
  const [currFiles, setFile] = useState<Array<File> | File | null>(null);
  const [error, setError] = useState(false);

  const validateFile = (file: File) => {
    if (types && !checkType(file, types)) {
      // types included and type not in them
      setError(true);
      setUploaded(false);
      if (onTypeError) onTypeError("File type is not supported");
      return false;
    }
    if (maxSize && getFileSizeMB(file.size) > maxSize) {
      setError(true);
      setUploaded(false);
      if (onSizeError) onSizeError("File size is too big");
      return false;
    }
    if (minSize && getFileSizeMB(file.size) < minSize) {
      setError(true);
      setUploaded(false);
      if (onSizeError) onSizeError("File size is too small");
      return false;
    }
    return true;
  };

  const handleChanges = (files: File | Array<File>): boolean => {
    let checkError = false;
    if (files) {
      if (files instanceof File) {
        checkError = !validateFile(files);
      } else {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          checkError = !validateFile(file) || checkError;
        }
      }
      if (checkError) return false;
      if (handleChange) handleChange(files);
      setFile(files);

      setUploaded(true);
      setError(false);
      return true;
    }
    return false;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blockEvent = (ev: any) => {
    ev.preventDefault();
    ev.stopPropagation();
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClick = (ev: any) => {
    ev.stopPropagation();
    // eslint-disable-next-line no-param-reassign
    if (inputRef && inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (ev: any) => {
    const allFiles = ev.target.files;
    const files = multiple ? allFiles : allFiles[0];
    const success = handleChanges(files);
    if (onSelect && success) onSelect(files);
  };
  const dragging = useDragging({
    labelRef,
    inputRef,
    multiple,
    handleChanges,
    onDrop,
  });

  useEffect(() => {
    onDraggingStateChange?.(dragging);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging]);

  useEffect(() => {
    if (fileOrFiles) {
      setUploaded(true);
      setFile(fileOrFiles);
    } else {
      if (inputRef.current) inputRef.current.value = "";
      setUploaded(false);
      setFile(null);
    }
  }, [fileOrFiles]);

  return (
    <UploadWrapper
      ref={labelRef}
      htmlFor={name}
      onClick={blockEvent}
      className={className}
      disabled={disabled}
      variant={variant}
      uploaded={uploaded}
      error={error}
      unstyled={unstyled}
    >
      <input
        onClick={handleClick}
        onChange={handleInputChange}
        accept={acceptedExt(types)}
        ref={inputRef}
        type="file"
        name={name}
        disabled={disabled}
        multiple={multiple}
        required={required}
        hidden
      />
      {!children && (
        <>
          {dragging && (
            <HoverMessage>
              <span>{hoverTitle || "Drop Here"}</span>
            </HoverMessage>
          )}
          <UploadCloud
            data-uploaded={uploaded}
            data-error={error}
            className="upload-icon w-8 h-8 text-purple-700 data-[uploaded=true]:text-green-700 data-[error=true]:text-red-700"
          />
          <DescriptionWrapper unstyled={unstyled} error={error}>
            {error ? (
              <span className="message-error-type-or-size">
                {messageError || "File type/size error, Hovered on types!"}
              </span>
            ) : (
              <Description
                currFile={currFiles}
                disabled={disabled}
                label={label || ""}
                description={description}
                uploaded={uploaded}
                types={types}
                variant={variant}
                messageSuccess={messageSuccess}
                unstyled={unstyled}
              />
            )}
          </DescriptionWrapper>
        </>
      )}
      {typeof children === "function" &&
        children({
          dragging,
          currFiles,
          error,
          maxSize,
          minSize,
          types,
          uploaded,
          label,
          disabled,
        })}

      {typeof children !== "function" && (
        <>
          {dragging && (
            <HoverMessage>
              <span>{hoverTitle || "Drop Here"}</span>
            </HoverMessage>
          )}
          {children}
        </>
      )}
    </UploadWrapper>
  );
};

export function DescriptionWrapper({
  className,
  unstyled,
  ...props
}: DescriptionWrapperProps) {
  return (
    <div
      data-error={props.error}
      className={
        !unstyled
          ? twMerge(
              "upload-description flex justify-between flex-1 text-xs data-[error=true]:text-red-700",
              className
            )
          : className
      }
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
  unstyled,
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
    <span
      className={
        !unstyled ? twMerge(baseStyles[variant], className) : className
      }
      {...props}
    >
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

export function DrawTypes({
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
      unstyled,
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
        className={
          !unstyled ? twMerge(baseStyles[variant], className) : className
        }
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

export default DragDropUpload;
