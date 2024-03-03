import { useState } from "react";
import { ReactDragDropUpload } from "./components/react-drag-drop-upload";

function App() {
  const [fileOrFilesData, setFileOrFilesData] = useState(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (data: any) => {
    setFileOrFilesData(data);
    console.log("handleChange", fileOrFilesData);
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <ReactDragDropUpload
        handleChange={handleChange}
        className="border-zinc-700"
        types={["JPG", "PNG"]}
        multiple={false}
        variant="small"
      />
    </div>
  );
}

export default App;
