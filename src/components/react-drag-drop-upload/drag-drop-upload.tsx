import React, { ReactNode, useEffect, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

import { acceptedExt, checkType, getFileSizeMB } from "../../utils";
import {
  DescriptionWrapper,
  DrawDesc,
  HoverMessage,
  UploadWrapper,
} from "./upload-components";
import useDragging from "../../hooks/use-dragging";

export interface FileUploaderProps {
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

export interface DraDropUploadProps {
  name?: string;
  messageSuccess?: string;
  messageError?: string;
  variant?: "large" | "small";
  hoverTitle?: string;
  types?: Array<string>;
  className?: string | undefined;
  children?: (props: FileUploaderProps) => ReactNode | ReactNode;
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
  dropMessageStyle?: React.CSSProperties | undefined;
}

const DraDropUpload: React.FC<DraDropUploadProps> = (
  props: DraDropUploadProps
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
    dropMessageStyle,
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
            <HoverMessage style={dropMessageStyle}>
              <span>{hoverTitle || "Drop Here"}</span>
            </HoverMessage>
          )}
          <UploadCloud
            data-uploaded={uploaded}
            data-error={error}
            className="upload-icon w-8 h-8 text-purple-700 data-[uploaded=true]:text-green-700 data-[error=true]:text-red-700"
          />
          <DescriptionWrapper error={error}>
            <DrawDesc
              currFile={currFiles}
              disabled={disabled}
              label={label}
              description={description}
              typeError={error}
              uploaded={uploaded}
              types={types}
              variant={variant}
              messageError={messageError}
              messageSuccess={messageSuccess}
            />
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
            <HoverMessage style={dropMessageStyle}>
              <span>{hoverTitle || "Drop Here"}</span>
            </HoverMessage>
          )}
          {children}
        </>
      )}
    </UploadWrapper>
  );
};
export default DraDropUpload;
