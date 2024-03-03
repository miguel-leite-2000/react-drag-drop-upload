import { useState } from "react";
import { ReactDragDropUpload } from "./components/react-drag-drop-upload";
import {
  DescriptionWrapper,
  DrawDesc,
} from "./components/react-drag-drop-upload/upload-components";
import { UploadCloud } from "lucide-react";

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
        maxSize={1024 * 1024}
        variant="large"
      />
    </div>
  );
}

export default App;
