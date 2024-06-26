"use client";
import React, { useEffect, useState } from "react";
import StyledButton from "@/components/StyledButton";
import { useRouter } from "next/navigation";
import { Button, Col, InputNumber, Popover, Row, Upload } from "antd";
import {
  Code,
  CompleteForm,
  CompleteFormParams,
  Form,
  FormRowParams,
} from "@/interfaces/interfaces";
import Link from "next/link";
import { buRed } from "@/_common/styles";
import { DeleteOutlined, DownloadOutlined } from "@ant-design/icons";
import useDownloader from "react-use-downloader";
import { getCodes, getForms } from "@/app/(user)/user/forms/action";
import { deleteForm } from "./action";

const Forms: React.FC = () => {
  const router = useRouter();
  const [forms, setForms] = useState<Form[]>();
  const [codes, setCodes] = useState<Code[]>([]);
  const { size, elapsed, percentage, download, cancel, error, isInProgress } =
    useDownloader();
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [formDeleted, setFormDeleted] = useState<number | null>(null);

  useEffect(() => {
    if (formDeleted == null) return;
    const fetchDelete = async () => {
      try {
        const response = await deleteForm(formDeleted);
        if (response) {
          if (forms?.length != undefined && forms?.length > 0) {
            setForms((prevForms) =>
              prevForms?.filter((f) => f.id !== formDeleted)
            );
            console.log("Form deleted successfully");
          }
        } else {
          console.error("Failed to delete form");
        }
      } catch (error) {
        console.error("Error deleting form:", error);
      } finally {
        setFormDeleted(null);
      }
    };
    fetchDelete();
  }, [formDeleted]);

  const FormRow = ({ form, codes, isFirst }: FormRowParams) => {
    const getFormCode = (form: Form, codes: Code[]): CompleteFormParams => {
      const code = codes.find((code: Code) => code.id === form.type);
      if (!code) {
        return {
          title: "",
          description: "",
          downloadable: false,
          upload_link: "",
        };
      }
      const codeObject: CompleteFormParams = {
        title: code.title,
        description: code.description,
        downloadable: code.downloadable,
        upload_link: code.upload_link,
      };
      return codeObject;
    };

    const decodedForm: CompleteFormParams = getFormCode(form, codes);
    const completeForm: CompleteForm = {
      id: form.id,
      title: decodedForm.title,
      description: decodedForm.description,
      file: form.file,
      student_id: form.student_id,
      downloadable: decodedForm.downloadable,
      upload_link: decodedForm.upload_link?.toString() || null,
    };
    //if an html form render this button
    const SingleButton = () => {
      const formPath = decodeURIComponent(completeForm.title.toString())
        .toLowerCase()
        .replace(/\s+/g, "-");
      return (
        <div
          className="buttons"
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Link href={`forms/${formPath}`}>
            <button
              style={{
                background: buRed,
                width: "5em",
                height: "2em",
                color: "white",
                border: "0px",
                cursor: "pointer",
              }}
              onClick={() => {}}
            >
              Start
            </button>
          </Link>
        </div>
      );
    };

    const handleFormDelete = (form: any) => {
      if (deleteConfirm == form.id) {
        setFormDeleted(form.id);
        setDeleteConfirm(null);
      } else {
        setDeleteConfirm(form.id);
      }
    };

    const DeleteButton = () => {
      return (
        <Button
          style={{
            backgroundColor: "transparent",
            color: buRed,
            border: "none",
            boxShadow: "none",
            position: "relative",
            padding: "10px",
            fontWeight: "800",
            fontSize: "large",
            marginLeft: "0.5rem",
          }}
          onClick={() => handleFormDelete(form)}
        >
          {deleteConfirm == form.id ? (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span
                style={{
                  background: buRed,
                  width: "5em",
                  height: "2em",
                  color: "white",
                  border: "0px",
                  cursor: "pointer",
                  display: "inline-block",
                  textAlign: "center",
                  lineHeight: "2em",
                  fontWeight: "400",
                  fontSize: "small",
                  padding: "0.05rem",
                  marginRight: "1rem",
                }}
              >
                Confirm
              </span>
              <span
                style={{
                  background: "white",
                  width: "5em",
                  height: "2em",
                  color: buRed,
                  border: "0px",
                  cursor: "pointer",
                  display: "inline-block",
                  textAlign: "center",
                  lineHeight: "2em",
                  fontWeight: "400",
                  fontSize: "small",
                  padding: "0.05rem",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteConfirm(null);
                }}
              >
                Cancel
              </span>
            </div>
          ) : (
            <DeleteOutlined style={{ fontSize: "xx-large" }} />
          )}
        </Button>
      );
    };

    const handleDownload = () => {
      // check if its a redirect form (goes to a seperate page)
      console.log(completeForm.file);
      if (completeForm.file.startsWith("REDIRECT-")) {
        window.open(completeForm.file.toString().substring(9), "_blank");
      } else {
        console.log(`Downloading ${completeForm.title}`);
        download(`/forms/${completeForm.file}`, completeForm.title.toString());
      }
    };

    //if uploadable file render these buttons
    const UploadableFileButtons = () => {
      return (
        <div
          className="buttons"
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Button
            style={{ background: "none", border: "none", marginRight: "2em" }}
            icon={
              <DownloadOutlined
                style={{ fontSize: "3em", color: buRed, cursor: "pointer" }}
              />
            }
            onClick={() => {
              handleDownload();
            }}
          ></Button>
          <button
            style={{
              background: buRed,
              width: "5em",
              height: "2em",
              color: "white",
              border: "0px",
              cursor: "pointer",
            }}
            onClick={() =>
              completeForm?.upload_link
                ? window.open(completeForm.upload_link.toString(), "_blank")
                : console.log(completeForm)
            }
          >
            Upload
          </button>
        </div>
      );
    };

    return completeForm && completeForm.downloadable ? (
      <Col
        span={24}
        style={{
          backgroundColor: "#EBEBEB",
          height: "5em",
          margin: "2px",
          borderTopLeftRadius: isFirst ? "10px" : "0px",
          borderTopRightRadius: isFirst ? "10px" : "0px",
        }}
      >
        <div
          style={{
            // marginLeft: "0.5rem",
            padding: "0em 2em",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            className="form-name"
            style={{ display: "block", maxWidth: "75%" }}
          >
            <h3 style={{ marginBottom: "-5px", marginTop: "0.5em" }}>
              {completeForm.title}
            </h3>
            <p style={{ marginTop: "0.5em" }}>{completeForm.description}</p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            {completeForm.downloadable ? (
              <UploadableFileButtons />
            ) : (
              <SingleButton />
            )}
            <DeleteButton />
          </div>
        </div>
      </Col>
    ) : (
      <></>
    );
  };

  const navigate = () => {
    router.push("/admin/forms/add-form");
  };

  useEffect(() => {
    const fetchForms = async () => {
      const forms = await getForms();
      setForms(forms);
    };
    fetchForms();

    const fetchCodes = async () => {
      const codes = await getCodes();
      // console.log("codes:", codes);
      setCodes(codes);
    };
    fetchCodes();
  }, []);

  return (
    <div>
      <StyledButton
        text="+ Add Form"
        selected={true}
        onClick={() => {
          navigate();
        }}
      />
      <div style={{ marginTop: "2rem" }}>
        <Row style={{ marginRight: "3em" }}>
          {" "}
          {forms ? (
            forms.map((typeCode, index) => (
              <FormRow
                key={index}
                form={typeCode}
                codes={codes}
                isFirst={index === 0}
              />
            ))
          ) : (
            <div>
              <p>Loading forms...</p>
            </div>
          )}
        </Row>
      </div>
    </div>
  );
};

export default Forms;
