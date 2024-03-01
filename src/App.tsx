import { useState } from "react";
import { ReactDragDropUpload } from "./components/react-drag-drog-upload";
import DrawTypes, {
  DescriptionWrapper,
  DrawDesc,
} from "./components/react-drag-drog-upload/upload-components";
import { Upload } from "lucide-react";

function App() {
  const [fileOrFiles, setFile] = useState(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (fileOrFiles: any) => {
    setFile(fileOrFiles);
    console.log("handleChange", fileOrFiles);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDrop = (fileOrFiles: any) => {
    console.log("onDrop", fileOrFiles);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSelect = (fileOrFiles: any) => {
    console.log("onSelect", fileOrFiles);
  };

  const onTypeError = (error: string) => console.log(error);
  const onSizeError = (error: string) => console.log(error);
  console.log(fileOrFiles);

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <ReactDragDropUpload
        onSelect={onSelect}
        onDrop={onDrop}
        handleChange={handleChange}
        onTypeError={onTypeError}
        onSizeError={onSizeError}
        className="border-zinc-700"
        types={["JPG", "PNG"]}
        multiple={false}
      >
        {({
          currFiles,
          uploaded,
          error,
          disabled,
          label,
          types,
          maxSize,
          minSize,
        }) => (
          <div className="flex flex-col gap-2 items-center">
            <Upload className="w-8 h-8 text-zinc-700" />
            <DescriptionWrapper error={error}>
              <DrawDesc
                currFile={currFiles}
                disabled={disabled}
                label={label}
                typeError={error}
                uploaded={uploaded}
              />
              <DrawTypes types={types} minSize={minSize} maxSize={maxSize} />
            </DescriptionWrapper>
          </div>
        )}
      </ReactDragDropUpload>
    </div>
  );
}

export default App;
