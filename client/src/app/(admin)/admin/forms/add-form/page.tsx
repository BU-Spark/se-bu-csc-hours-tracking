"use client";
import React, { useEffect, useState } from "react";
import StyledButton from "@/components/StyledButton";
import styled from "styled-components";
import { redirect, useRouter } from "next/navigation";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Button, Col, Form, Row, Typography, Upload, message } from "antd";

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
import { CreateFormResponse, NewForm } from "@/interfaces/interfaces";
import { createForm } from "./action";

const Forms: React.FC = () => {
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [fileLink, setFileLink] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  useEffect(() => {
    // Check if all fields are filled
    if (title && description && destination && fileLink) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [title, description, destination, fileLink]);

  useEffect(() => {
    if (!loading) return;

    const fetchCreateForm = async () => {
      const body: NewForm = {
        title: title,
        description: description,
        fileLink: fileLink,
        uploadLink: destination,
      };

      try {
        const newObjects = await createForm(body);
        if (!newObjects) {
          console.error("bad frontend response");
          return;
        }
        // console.log("success", newObjects);
        setLoading(false);
        router.push("/admin/forms");
      } catch (error) {
        console.error(error);
      }
    };
    fetchCreateForm();
  }, [loading]);

  const handleSubmit = async () => {
    if (!fileLink) {
      message.error("Please upload a file.");
      return;
    }
    setLoading(true);
    return;
  };

  

  return (
    <div>
      <FormContainer>
        <BackButton onClick={() => router.push("/admin/forms")}>
          <AiOutlineArrowLeft size={24} />
          <span>Back to Forms</span>
        </BackButton>
        <h1>Add Form</h1>
        <Form onFinish={handleSubmit}>
          <Label>
            <LabelTitle>
              Form Title
              <Asterisk>*</Asterisk>
            </LabelTitle>
            <TextArea
              placeholder="Waiver Form"
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
              placeholder="A legal document relinquishing specified rights or privileges"
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
              placeholder="https://example.com/"
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
            <TextArea
              placeholder="https://example.com/"
              rows={1}
              value={fileLink}
              onChange={(e) => setFileLink(e.target.value)}
            />
          </Label>
          <SubmitButton
            type="submit"
            style={{ opacity: isFormValid ? "100%" : "40%" }}
            disabled={isFormValid ? false : true}
          >
            Submit
          </SubmitButton>
        </Form>
      </FormContainer>
    </div>
  );
};

export default Forms;
