"use client";
import React from "react";
import { Button, Col, Row, Typography } from "antd";
const { Title, Paragraph } = Typography;
import { buRed } from "@/common/styles";
import { DownloadOutlined } from "@ant-design/icons";
import { send } from "./action";

function Forms() {
  interface FormRowParams {
    form: Form;
    codes: any;
    isFirst: boolean;
  }
  interface Form {
    id: number;
    type: number;
    file: String;
    student_id: number;
  }

  //returns a single form row
  const FormRow = ({ form, codes, isFirst }: FormRowParams) => {
    const getForm = () => {
      return codes.find((code: { id: any }) => code.id === form.type);
    };

    const theForm = getForm();

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
              {theForm.title}
            </h3>
            <p>{theForm.description}</p>
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
                console.log(`Downloading ${theForm.title}`);
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

  // Dummy data
  const getAllForms = () => {
    const forms = [
      { id: 1, type: 1, file: "file1.pdf", student_id: 1 },
      { id: 2, type: 2, file: "file2.pdf", student_id: 2 },
    ];
    return forms;
  };

  //dummy data
  const getAllCodes = () => {
    const codes = [
      {
        id: 1,
        title: "Registration",
        description: "Student registration form",
      },
      { id: 2, title: "Consent", description: "Parental consent form" },
    ];

    return codes;
  };

  // replace with DB calls
  const forms = getAllForms();
  const codes = getAllCodes();

  return (
    <>
      <Row style={{ marginRight: "3em" }}>
        {" "}
        {forms.map((typeCode, index) => (
          <FormRow
            key={index}
            form={typeCode}
            codes={codes}
            isFirst={index === 0}
          />
        ))}
      </Row>
      <form action={send}>
        <button>Send It</button>
      </form>
    </>
  );
}

export default Forms;
