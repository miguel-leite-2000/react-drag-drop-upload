import React, { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Upload } from "lucide-react";

import { acceptedExt, checkType, getFileSizeMB } from "../../utils";
import DrawTypes, {
  Description,
  DescriptionWrapper,
  HoverMessage,
  UploadWrapper,
} from "./upload-components";
import useDragging from "../../hooks/use-dragging";

type Props = {
  name?: string;
  hoverTitle?: string;
  types?: Array<string>;
  classes?: string;
  children?: JSX.Element;
  maxSize?: number;
  minSize?: number;
  fileOrFiles?: Array<File> | File | null;
  disabled?: boolean | false;
  label?: string | undefined;
  multiple?: boolean | false;
  required?: boolean | false;
  onSizeError?: (arg0: string) => void;
  onTypeError?: (arg0: string) => void;
  onDrop?: (arg0: File | Array<File>) => void;
  onSelect?: (arg0: File | Array<File>) => void;
  handleChange?: (arg0: File | Array<File> | File) => void;
  onDraggingStateChange?: (dragging: boolean) => void;
  dropMessageStyle?: React.CSSProperties | undefined;
};
/**
 *
 * Draw a description on the frame
 * @param currFile - The uploaded file
 * @param uploaded - boolean to check if the file uploaded or not yet
 * @param typeError - boolean to check if the file has type errors
 * @param disabled - boolean to check if input is disabled
 * @param label - string to add custom label
 * @returns JSX Element
 *
 * @internal
 *
 */
const drawDescription = (
  currFile: Array<File> | File | null,
  uploaded: boolean,
  typeError: boolean,
  disabled: boolean | undefined,
  label: string | undefined
) => {
  return typeError ? (
    <span className="message-error-type-or-size">
      File type/size error, Hovered on types!
    </span>
  ) : (
    <Description
      currFile={currFile}
      disabled={disabled}
      label={label}
      uploaded={uploaded}
    />
  );
};

/**
 * File uploading main function
 * @param props - {name,
    hoverTitle,
    types,
    handleChange,
    classes,
    children,
    maxSize,
    minSize,
    fileOrFiles,
    onSizeError,
    onTypeError,
    onSelect,
    onDrop,
    onTypeError,
    disabled,
    label,
    multiple,
    required,
    onDraggingStateChange
  }
 * @returns JSX Element
 */
const FileUploader: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    name,
    hoverTitle,
    types,
    handleChange,
    classes,
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
      if (onTypeError) onTypeError("File type is not supported");
      return false;
    }
    if (maxSize && getFileSizeMB(file.size) > maxSize) {
      setError(true);
      if (onSizeError) onSizeError("File size is too big");
      return false;
    }
    if (minSize && getFileSizeMB(file.size) < minSize) {
      setError(true);
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
      className={classes}
      disabled={disabled}
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
      />
      {dragging && (
        <HoverMessage style={dropMessageStyle}>
          <span className="hover-title absolute top-[50%] left-[50%] translate-x-[50%] translate-y-[50%]">
            {hoverTitle || "Drop Here"}
          </span>
        </HoverMessage>
      )}
      {!children && (
        <>
          <Upload className={twMerge("upload-icon w-8 h-8 text-primary")} />
          <DescriptionWrapper error={error}>
            {drawDescription(currFiles, uploaded, error, disabled, label)}
            <DrawTypes types={types} minSize={minSize} maxSize={maxSize} />
          </DescriptionWrapper>
        </>
      )}
      {children}
    </UploadWrapper>
  );
};
export default FileUploader;
