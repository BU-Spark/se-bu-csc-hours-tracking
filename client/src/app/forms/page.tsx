"use client";
import React, { useEffect, useState } from "react";
import { Button, Col, Row, Typography } from "antd";
import { buRed } from "@/common/styles";
import { DownloadOutlined } from "@ant-design/icons";
import { getCodes, getForms } from "./action";
import { API_URL } from "@/constants";
import useDownloader from "react-use-downloader";

function Forms() {
  const [forms, setForms] = useState<Form[]>([]);
  const [codes, setCodes] = useState<Code[]>([]);
  const { size, elapsed, percentage, download, cancel, error, isInProgress } =
    useDownloader();

  interface FormRowParams {
    form: Form;
    codes: any;
    isFirst: boolean;
  }
  interface Form {
    id: number;
    type: number;
    file: String;
    student_id: number | null;
  }
  interface Code {
    id: number;
    title: String;
    description: String;
  }

  //returns a single form row
  const FormRow = ({ form, codes, isFirst }: FormRowParams) => {
    const getFormCode = (form: Form, codes: Code[]) => {
      const code = codes.find((code: Code) => code.id === form.type);
      return code ? [code.title, code.description] : "";
    };

    const decodedForm = getFormCode(form, codes);
    const completeForm = {
      id: form.id,
      title: decodedForm[0],
      description: decodedForm[1],
      file: form.file,
      student_id: form.student_id,
    };

    return (
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
          <div className="form-name" style={{ display: "block" }}>
            <h3 style={{ marginBottom: "-5px", marginTop: "0.5em" }}>
              {completeForm.title}
            </h3>
            <p>{completeForm.description}</p>
          </div>
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
                console.log(`Downloading ${completeForm.title}`);
                download(
                  `/forms/${completeForm.file}`,
                  completeForm.title.toString()
                );
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
            >
              Start
            </button>
          </div>
        </div>
      </Col>
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
    </>
  );
}

export default Forms;


// Dummy data
// const getAllForms = () => {
//   const forms = [
//     { id: 1, type: 1, file: "file1.pdf", student_id: 1 },
//     { id: 2, type: 2, file: "file2.pdf", student_id: 2 },
//   ];
//   return forms;
// };

//dummy data
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

// replace with DB calls
// const forms = getAllForms();
// const codes = getAllCodes();