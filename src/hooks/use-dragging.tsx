import { useState, useEffect, useCallback } from "react";

let draggingCount = 0;
type Params = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  labelRef: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputRef: any;
  multiple?: boolean | false;
  handleChanges: (arg0: Array<File>) => boolean;
  onDrop?: (arg0: Array<File>) => void;
};

/**
 *
 * @param data - labelRef, inputRef, handleChanges, onDrop
 * @returns boolean - the state.
 *
 * @internal
 */
export default function useDragging({
  labelRef,
  inputRef,
  multiple,
  handleChanges,
  onDrop,
}: Params): boolean {
  const [dragging, setDragging] = useState(false);
  const handleClick = useCallback(() => {
    inputRef.current.click();
  }, [inputRef]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragIn = useCallback(
    (ev: {
      preventDefault: () => void;
      stopPropagation: () => void;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dataTransfer: { items: string | any[] };
    }) => {
      ev.preventDefault();
      ev.stopPropagation();
      draggingCount++;
      if (ev.dataTransfer.items && ev.dataTransfer.items.length !== 0) {
        setDragging(true);
      }
    },
    []
  );
  const handleDragOut = useCallback(
    (ev: { preventDefault: () => void; stopPropagation: () => void }) => {
      ev.preventDefault();
      ev.stopPropagation();
      draggingCount--;
      if (draggingCount > 0) return;
      setDragging(false);
    },
    []
  );
  const handleDrag = useCallback(
    (ev: { preventDefault: () => void; stopPropagation: () => void }) => {
      ev.preventDefault();
      ev.stopPropagation();
    },
    []
  );
  const handleDrop = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (ev: {
      preventDefault: () => void;
      stopPropagation: () => void;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dataTransfer: { files: any };
    }) => {
      ev.preventDefault();
      ev.stopPropagation();
      setDragging(false);
      draggingCount = 0;

      const eventFiles = ev.dataTransfer.files;
      if (eventFiles && eventFiles.length > 0) {
        const files = multiple ? eventFiles : eventFiles[0];
        const success = handleChanges(files);
        if (onDrop && success) onDrop(files);
      }
    },
    [handleChanges]
  );
  useEffect(() => {
    const ele = labelRef.current;
    ele.addEventListener("click", handleClick);
    ele.addEventListener("dragenter", handleDragIn);
    ele.addEventListener("dragleave", handleDragOut);
    ele.addEventListener("dragover", handleDrag);
    ele.addEventListener("drop", handleDrop);
    return () => {
      ele.removeEventListener("click", handleClick);
      ele.removeEventListener("dragenter", handleDragIn);
      ele.removeEventListener("dragleave", handleDragOut);
      ele.removeEventListener("dragover", handleDrag);
      ele.removeEventListener("drop", handleDrop);
    };
  }, [
    handleClick,
    handleDragIn,
    handleDragOut,
    handleDrag,
    handleDrop,
    labelRef,
  ]);

  return dragging;
}
