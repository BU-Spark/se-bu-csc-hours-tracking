import { Event, Reason } from "@prisma/client";
import {
  message,
  Checkbox,
  DatePicker,
  Form,
  Typography,
  Button,
  Dropdown,
  Select,
  Input,
} from "antd";
import dayjs from "dayjs";
import { buRed } from "@/_common/styles";
import { createApplication, createWaitlist, getReasons } from "./action";
import { useEffect, useState } from "react";

interface WaitlistFormProps {
  event: Event | undefined;
  setRegistering: (value: boolean) => void;
  userId: number;
  setHasWaitlisted: (value: boolean) => void;
}

const WaitlistForm: React.FC<WaitlistFormProps> = ({
  event,
  setRegistering,
  userId,
  setHasWaitlisted,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [isFormValid, setIsFormValid] = useState(false);
  const [reasonsDropdown, setReasonsDropdown] = useState<any>([]);

  useEffect(() => {
    const fetchReasons = async () => {
      const response = await getReasons();
      if (!response) {
        console.error("FetchReasons failed");
        return;
      }
      const items = response.map((reason: Reason) => ({
        key: reason.id,
        label: reason.meaning,
      }));
      setReasonsDropdown(items);
    };
    fetchReasons();
  }, []);

  const onFinish = (values: any) => {
    let errorReason = "date";
    if (
      dayjs(values.eventDate).format("YYYY-MM-DD HH:mm") ===
      dayjs(event?.event_start).format("YYYY-MM-DD HH:mm")
    ) {
      if (
        !event?.application_password ||
        event.application_password.length < 1
      ) {
        success("Waitlist Successful");
        if (event?.id) createWaitlist(event?.id, userId, values.reason);
        setTimeout(() => {
          setRegistering(false);
          setHasWaitlisted(true);
        }, 1000);
        return;
      }
      if (values.password === event?.application_password) {
        success("Waitlist Successful");
        if (event?.id) createWaitlist(event?.id, userId, values.reason);
        setTimeout(() => {
          setRegistering(false);
          setHasWaitlisted(true);
        }, 1000);
      } else {
        errorReason = "password";
        error(errorReason);
      }
    } else {
      console.log(
        values.password === event?.application_password,
        values.password
      );
      // console.log(false, event?.event_start);
      error(errorReason);
    }
  };

  const success = (message: string) => {
    messageApi.open({
      type: "success",
      content: message,
    });
  };

  const error = (mistake: string) => {
    messageApi.open({
      type: "error",
      content:
        mistake == "date"
          ? "Please input the correct event date/time"
          : mistake == "password"
          ? "Incorrect event password"
          : `Unknown error: ${mistake}`,
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
      className="event-waitlist"
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
          name="reason"
          label="Select a Reason"
          rules={[
            {
              required: true,
              message: "Select the reason you want to attend",
            },
          ]}
        >
          <Select placeholder="">
            {reasonsDropdown.map((item: any) => (
              <Select.Option key={item.key} value={item.key}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {event?.application_password ? (
          <Form.Item
            name={"password"}
            label={"Event Password"}
            rules={[
              {
                required:
                  event?.application_password != undefined &&
                  event?.application_password != null,
                message: "Please input the event password",
              },
            ]}
          >
            <Input />
          </Form.Item>
        ) : (
          ""
        )}
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

export default WaitlistForm;
