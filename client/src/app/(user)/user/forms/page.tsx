"use client";
import React, { useEffect, useState } from "react";
import { Button, Col, Row, Typography, Upload } from "antd";
import { buRed } from "@/_common/styles";
import { DownloadOutlined } from "@ant-design/icons";
import { createDummyForms, getCodes, getForms } from "./action";
import useDownloader from "react-use-downloader";
import Link from "next/link";
import {
  Form,
  Code,
  FormRowParams,
  CompleteForm,
  CompleteFormParams,
} from "@/interfaces/interfaces";

const Forms = () => {
  const [forms, setForms] = useState<Form[]>();
  const [codes, setCodes] = useState<Code[]>([]);
  const { size, elapsed, percentage, download, cancel, error, isInProgress } =
    useDownloader();

  //returns a single form row
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

    const handleDownload = () => {
      // check if its a redirect form (goes to a seperate page)
      if (completeForm.file.startsWith("REDIRECT-")) {
        alert(completeForm.file.toString().substring(9));
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
          {completeForm.downloadable ? (
            <UploadableFileButtons />
          ) : (
            <SingleButton />
          )}
        </div>
      </Col>
    ) : (
      <></>
    );
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
    <>
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
      {/* UNCOMMENT TO MAKE DUMMY DATA */}
      <button
        style={{ position: "fixed", bottom: 0 }}
        onClick={() => createDummyForms()}
      >
        Create Forms
      </button>
    </>
  );
};

export default Forms;


// // Dummy data
// const getAllForms = () => {
//   const forms = [
//     { id: 1, type: 1, file: "file1.pdf", student_id: 1 },
//     { id: 2, type: 2, file: "file2.pdf", student_id: 2 },
//   ];
//   return forms;
// };

// // dummy data
// const getAllCodes = () => {
//   const codes = [
//     {
//       id: 1,
//       title: "Registration",
//       description: "Student registration form",
//     },
//     { id: 2, title: "Consent", description: "Parental consent form" },
//   ];

//   return codes;
// };

// // replace with DB calls
// const forms = getAllForms();
// const codes = getAllCodes();