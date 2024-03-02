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

## Example

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

# Features

- Drag and drop file upload
- Customizable components
- Supports Tailwind CSS for styling
- Error handling for file type and size

# API

### ReactDragDropUpload Component

A component for drag and drop file upload with customizable options.

#### Props

- name?: string - The name attribute for the input element.
- hoverTitle?: string - The title to display when hovering over the drop area.
- types?: Array - An array of allowed file types.
- className?: string - Custom class name for styling.
- children?: (props: FileUploaderProps) => ReactNode | ReactNode - Render prop function to customize the component's rendering.
- maxSize?: number - The maximum allowed file size in bytes.
- minSize?: number - The minimum allowed file size in bytes.
- fileOrFiles?: Array | File | null - The currently selected file or files.
- disabled?: boolean - Indicates if the upload is disabled.
- label?: string - The label for the file input.
- multiple?: boolean - Allows multiple files to be uploaded.
- required?: boolean - Indicates if the input is required.
- onSizeError?: (arg: string) => void - Callback function for size errors.
- onTypeError?: (arg: string) => void - Callback function for type errors.
- onDrop?: (arg: File | Array) => void - Callback function when files are dropped.
- onSelect?: (arg: File | Array) => void - Callback function when files are selected.
- handleChange?: (arg: File | Array | File) => void - Callback function when files are selected or dropped.
- onDraggingStateChange?: (dragging: boolean) => void - Callback function for dragging state changes.
- dropMessageStyle?: React.CSSProperties - Custom styles for the drop message.

#### Usage

```tsx
<FileUploader
  name="file"
  types={["jpg", "png"]}
  maxSize={1024 * 1024 * 5} // 5MB
  onSizeError={(error) => console.log(error)}
  onTypeError={(error) => console.log(error)}
  onDrop={(files) => console.log("Files dropped:", files)}
>
  {({ currFiles, uploaded, error, disabled, label, types, maxSize, minSize }) => (
    // Custom rendering based on file upload state
    // e.g., show current file, upload progress, error messages, etc.
  )}
</FileUploader>
```

### UploadWrapper Component

A styled wrapper for the file upload component.

#### Props

- disabled?: boolean - Indicates if the upload is disabled.

#### Usage

```tsx
<UploadWrapper disabled={false}>
  {/* Render file upload components here */}
</UploadWrapper>
```

### DescriptionWrapper Component

A wrapper component for the file upload description.

#### Props

- error: boolean - Indicates if there is an error with the uploaded file.

#### Usage

```tsx
<DescriptionWrapper error={false}>
  {/* Render file description components here */}
</DescriptionWrapper>
```

### Description Component

A component to display the file upload description.

#### Props

- disabled: boolean | undefined - Indicates if the upload is disabled.
- label: string | undefined - The label for the file input.
- currFile: File | File\[\] | null - The currently selected file or files.
- uploaded: boolean | undefined - Indicates if the file has been successfully uploaded.

#### Usage

```tsx
<Description
  disabled={false}
  label="Upload file"
  currFile={selectedFile}
  uploaded={true}
/>
```

### DrawTypes Component

A component to display the allowed file types and size limits.

#### Props

- types?: Array - An array of allowed file types.
- minSize?: number - The minimum allowed file size in bytes.
- maxSize?: number - The maximum allowed file size in bytes.

#### Usage

```tsx
<DrawTypes types={["jpg", "png"]} minSize={1024} maxSize={1024 * 1024} />
```

### DrawDesc Component

A component to draw the file description based on the current file upload state.

#### Props

- currFile: Array | File | null - The currently selected file or files.
- uploaded: boolean - Indicates if the file has been successfully uploaded.
- typeError: boolean - Indicates if there is a file type error.
- disabled: boolean | undefined - Indicates if the upload is disabled.
- label: string | undefined - The label for the file input.

#### Usage

```tsx
<DrawDesc
  currFile={selectedFile}
  uploaded={true}
  typeError={false}
  disabled={false}
  label="Upload file"
/>
```

## License

This library is licensed under the MIT license. See the LICENSE file for details.

## Contributing

Feel free to contribute to this project by submitting issues or pull requests on GitHub.
