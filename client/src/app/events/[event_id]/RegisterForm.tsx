import { Event } from "@prisma/client";
import { message, Checkbox, DatePicker, Form, Typography, Button } from "antd";
import dayjs from "dayjs";
import { buRed } from "@/common/styles";
import { createApplication } from "./action";
import { useState } from "react";

interface RegisterFormProps {
  event: Event | undefined;
  setRegistering: (value: boolean) => void;
  userId: number;
  setHasRegistered: (value: boolean) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  event,
  setRegistering,
  userId,
  setHasRegistered,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [isFormValid, setIsFormValid] = useState(false);

  const onFinish = (values: any) => {
    if (
      dayjs(values.eventDate).format("YYYY-MM-DD HH:mm") ===
      dayjs(event?.event_start).format("YYYY-MM-DD HH:mm")
    ) {
      success();
      if (event?.id) createApplication(event?.id, userId);
      setTimeout(() => {
        setRegistering(false);
        setHasRegistered(true);
      }, 1000);
    } else {
      console.log(false, event?.event_start);
      error();
    }
  };

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Registration Successful",
    });
  };

  const error = () => {
    messageApi.open({
      type: "error",
      content: "Please input the correct event date/time",
    });
  };

  const onFieldsChange = () => {
    const hasErrors = form
      .getFieldsError()
      .some(({ errors }) => errors.length > 0);
    const isFormTouched = form.isFieldsTouched(true);
    setIsFormValid(isFormTouched && !hasErrors);
  };

  return (
    <div
      className="event-register"
      style={{
        width: "30rem",
        display: "flex",
        position: "relative",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F1F1F1",
        borderRadius: "4px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)",
        margin: "0rem auto",
      }}
    >
      <Form
        layout="horizontal"
        style={{ padding: "2rem", paddingBottom: "0rem" }}
        onFinish={onFinish}
        autoComplete="off"
        form={form}
        onFieldsChange={onFieldsChange}
      >
        <Form.Item
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography.Title level={3}>
            Registration Confirmation
          </Typography.Title>
        </Form.Item>
        <Form.Item
          name="eventDate"
          label="Confirm the Date"
          rules={[
            { required: true, message: "Please input the day of the event" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (
                  dayjs(getFieldValue("eventDate")).format(
                    "YYYY-MM-DD HH:mm"
                  ) != dayjs(event?.event_start).format("YYYY-MM-DD HH:mm")
                ) {
                  return Promise.reject(
                    "Please enter the correct start date/time"
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <DatePicker
            format="YYYY-MM-DD hh:mm A"
            showTime={{ format: "hh:mm A" }}
            width="10rem"
          />
        </Form.Item>
        <Form.Item
          name="agreeTerms"
          valuePropName="checked"
          rules={[
            { required: true, message: "Please agree" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (getFieldValue("agreeTerms") != true) {
                  return Promise.reject("Please agree to the terms");
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Checkbox>
            I agree to attend this event if application accepted
          </Checkbox>
        </Form.Item>
        <Form.Item
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "1rem",
          }}
        >
          {contextHolder}
          <Button
            style={{
              borderRadius: "20px",
              marginBottom: "0rem",
              width: "6rem",
              color: buRed,
              borderColor: buRed,
              backgroundColor: "white",
              opacity: isFormValid ? "100%" : "30%",
            }}
            htmlType="submit"
            type="primary"
            disabled={!isFormValid}
          >
            Apply
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterForm;
