import React from "react";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import "./CustomUpload.css";

const { Dragger } = Upload;

interface CustomUploadProps {
  action: string;
  onFileChange: (file: File | null) => void;
}

const CustomUpload: React.FC<CustomUploadProps> = ({
  action,
  onFileChange,
}) => {
  const maxSize = 10 * 1024 * 1024; // max of 10 mb upload
  const allowedTypes = ["application/pdf"]; // only allows pdfs

  const handleFileUpload = async (file: File) => {
    // console.log("file upload...");
  };

  const props = {
    name: "file",
    multiple: false,
    action: action,
    onChange(info: any) {
      const { status, originFileObj } = info.file;
      if (status !== "uploading") {
        // console.log("uploading...", info.file, info.fileList);
      }
      if (status === "done") {
        handleFileUpload(originFileObj);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    beforeUpload(file: File) {
      const fileType = file.type;
      if (file.size > maxSize) {
        message.error("File must be smaller than 10MB!");
        return Upload.LIST_IGNORE;
      }
      if (!allowedTypes.includes(fileType)) {
        message.error("Only PDF files are allowed!");
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    onRemove() {
      onFileChange(null);
    },
  };

  return (
    <Dragger {...props} style={{ width: "155%" }}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">
        Please upload a PDF of a maximum size of 10MB.
      </p>
    </Dragger>
  );
};

export default CustomUpload;
