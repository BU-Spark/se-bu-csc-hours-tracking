"use client";
import React, { useEffect, useState } from "react";
import StyledButton from "@/components/StyledButton";
import { Form, InputNumber, Upload } from "antd";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { AiOutlineArrowLeft } from "react-icons/ai";
import {
  Asterisk,
  BackButton,
  FileUpload,
  FormContainer,
  Label,
  LabelTitle,
  SubmitButton,
  TextArea,
} from "@/_common/styledDivs";
import CustomUpload from "@/components/Upload/CustomUpload";

const Forms: React.FC = () => {
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [file, setFile] = useState<File>();
  const action = "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload";

  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  useEffect(() => {
    // Check if all fields are filled
    if (title && description && destination && file) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [title, description, destination, file]);

  const handleFileChange = (file: File) => {
    setFile(file);
  };

  return (
    <div>
      <FormContainer>
        <BackButton onClick={() => router.push("/user/my-hours")}>
          <AiOutlineArrowLeft size={24} />
          <span>Back to Forms</span>
        </BackButton>
        <h1>Add Form</h1>
        <form onSubmit={() => console.log("submitted")}>
          <Label>
            <LabelTitle>
              Form Title
              <Asterisk>*</Asterisk>
            </LabelTitle>
            <TextArea
              rows={1}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Label>
          <Label>
            <LabelTitle>
              Form Description
              <Asterisk>*</Asterisk>
            </LabelTitle>
            <TextArea
              rows={1}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Label>
          <Label>
            {/* This can be made optional later */}
            <LabelTitle>
              Destination (link to where students should upload)
              <Asterisk>*</Asterisk>
            </LabelTitle>
            <TextArea
              rows={1}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </Label>
          <Label>
            <LabelTitle>
              File
              <Asterisk>*</Asterisk>
            </LabelTitle>
            <CustomUpload action={action} onFileChange={handleFileChange} />
          </Label>
          <SubmitButton
            type="submit"
            style={{ opacity: isFormValid ? "100%" : "40%" }}
            disabled={isFormValid ? false : true}
          >
            Submit
          </SubmitButton>
        </form>
      </FormContainer>
    </div>
  );
};

export default Forms;
