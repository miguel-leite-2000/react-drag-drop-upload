# React Drag Drop Upload

React Drag Drop Upload is a lightweight library for uploading files and images with drag and drop, styled with Tailwind CSS and supporting customization.

# Installation

npm:

```bash
npm install react-drag-drop-upload
```

yarn:

```bash
yarn add react-drag-drop-upload
```

# Example

```tsx
import { useState } from "react";
import { ReactDragDropUpload } from "react-drag-drop-upload";
import DrawTypes, {
  DescriptionWrapper,
  DrawDesc,
} from "react-drag-drop-upload/upload-components";
import { Upload } from "lucide-react";

function App() {
  const [fileOrFiles, setFile] = useState(null);

  const handleChange = (fileOrFiles) => {
    setFile(fileOrFiles);
    console.log("handleChange", fileOrFiles);
  };

  const onDrop = (fileOrFiles) => {
    console.log("onDrop", fileOrFiles);
  };

  const onSelect = (fileOrFiles) => {
    console.log("onSelect", fileOrFiles);
  };

  const onTypeError = (error) => console.log(error);
  const onSizeError = (error) => console.log(error);

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
```

# Main Features
