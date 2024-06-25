import React from "react";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";
import { buRed } from "@/_common/styles";
import "./CustomUpload.css";

const { Dragger } = Upload;

interface CustomUploadProps {
  action: any;
  onFileChange: any;
}

const CustomUpload: React.FC<CustomUploadProps> = ({
  action,
  onFileChange,
}) => {
  const props: UploadProps = {
    name: "file",
    multiple: false,
    action: action,
    onChange(info) {
      const { status, originFileObj } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
        onFileChange(originFileObj);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onRemove() {
      onFileChange(null);
    },
  };

  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined color={`${buRed} !important`} />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibited from uploading
        company data or other banned files.
      </p>
    </Dragger>
  );
};

export default CustomUpload;
