import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Upload,
  Modal,
  Select,
  message,
  UploadFile,
  Row,
  Col
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { Category, Event, Organization, Person } from "@prisma/client";
import { getCategories, getOrganizations } from "../action";
import convertToBase64 from "@/app/_utils/BufferToString";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;


const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const BackButton = styled(Button)`
  margin-bottom: 20px;
`;

const StyledButton = styled(Button)`
  margin-top: 20px;
`;

const SubmitButton = styled(Button)`
  margin-left: 10px;
`;

interface AdminEditEventFormProps {
  event: Event;
  onUpdate: (updatedEvent: Event) => void;
  onCancel: () => void;
}

const ModifyEventForm: React.FC<AdminEditEventFormProps> = ({
  event,
  onUpdate,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetchCategories();
    fetchOrganizations();
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      category: event.category_id,
      organizations: event.organization_id,
      ...event,
      dates: [dayjs(event.event_start), dayjs(event.event_end)],
      registrationDates: [dayjs(event.reg_start), dayjs(event.reg_end)],
      image: event.image,
    });
    setLoading(false);
  }, [event, form, categories, organizations]);

  const fetchCategories = async () => {
    try {
      const categoriesResponse: Category[] | undefined = await getCategories();
      if (!categoriesResponse) {
        console.error("bad categoriesResponse");
        return;
      }

      setCategories(categoriesResponse);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const organizationsResponse: Organization[] | undefined =
        await getOrganizations();
      if (!organizationsResponse) {
        console.error("bad organizationsResponse");
        return;
      }

      setOrganizations(organizationsResponse);
    } catch (error) {
      console.error(error);
    }
  };

  interface RcFile extends File {
    uid: string;
    lastModifiedDate: Date;
  }

  const handleFinish = async (values: any) => {
    const { dates, registrationDates, ...updatedValues } = values;
    const updatedEvent: Event = {
      ...event,
      ...updatedValues,
      estimated_participants: Number(values.estimated_participants),
      event_start: values.dates[0].toDate(),
      event_end: values.dates[1].toDate(),
      reg_start: values.registrationDates[0].toDate(),
      reg_end: values.registrationDates[1].toDate(),
      image: imageUploaded
        ? await convertFileToBase64(updatedValues.image[0].originFileObj)
        : event.image,
      password: values.password ? values.password : undefined,
    };
    onUpdate(updatedEvent);
  };

  //IMAGE UPLOAD METHODS

  const MAX_FILE_SIZE_MB = 5;

  const validateFileSize = (file: UploadFile) => {
    console.log("File:", file); // Log the file object
    console.log("File type:", typeof file); // Check the type of file
    let fileSizeMB = 1000000000;
    if (file.size) {
      fileSizeMB = file.size / 1024 / 1024;
    }

    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      message.error(`File must be smaller than ${MAX_FILE_SIZE_MB}MB!`);
      return false;
    }
    return true;
  };

  const checkFileSize = (_: any, fileList: UploadFile[]) => {
    if (fileList.length === 0) return Promise.reject("Please upload an image");
    const file: UploadFile = fileList[0];
    console.log("File:", file); // Log the file object
    console.log("File type:", typeof file); // Check the type of file
    return validateFileSize(file) ? Promise.resolve() : Promise.reject();
  };

  const bufferToUploadFile = (buffer: Buffer): UploadFile => {
    const file = new File([buffer], "image.png", { type: "image/png" });
    return {
      uid: (100 * Math.random()).toString(),
      lastModifiedDate: new Date(),
      name: event.title,
      status: "done",
      url: URL.createObjectURL(file),
      originFileObj: file as RcFile,
    };
  };

  const convertFileToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (reader.result) {
          resolve((reader.result as string).split(",")[1]);
        } else {
          reject("File reading failed");
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };
  return loading ? (
    <>Loading event...</>
  ) : (
    <FormContainer>
      <BackButton onClick={onCancel}>Back</BackButton>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          ...event,
          estimated_participants: event.estimated_participants,
          category: event.category_id,
          organization: event.organization_id,
          password: event.application_password,
          dates: [dayjs(event.event_start), dayjs(event.event_end)],
          registrationDates: [dayjs(event.reg_start), dayjs(event.reg_end)],
          image: event.image,
        }}
      >
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Please enter the event title" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="location"
              label="Location"
              rules={[
                { required: true, message: "Please enter the event location" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select>
                {categories.map((category) => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="estimated_participants"
              label="Estimated Participants"
              rules={[
                {
                  required: true,
                  message: "Please enter the estimated number of participants",
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="dates"
              label="Event Dates"
              rules={[{ required: true, message: "Please select the event dates" }]}
            >
              <RangePicker showTime />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="registrationDates"
              label="Registration Dates"
              rules={[
                { required: true, message: "Please select the registration dates" },
              ]}
            >
              <RangePicker showTime />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name="transit" label="Transit">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="password"
              label="Event Password"
              rules={[{ required: false }]}
            >
              <TextArea rows={1} />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: "Please enter the event description" },
              ]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
          </Col>
          
        </Row>

        <Form.Item
          name="image"
          label="Image Upload"
          valuePropName="fileList2"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
          rules={[
            { required: true, message: "Please upload an image!" },
            { validator: checkFileSize },
          ]}
        >
          <Upload
            listType="picture"
            maxCount={1}
            beforeUpload={validateFileSize}
            onChange={() => setImageUploaded(true)}
            defaultFileList={[bufferToUploadFile(event.image)]}
          >
            <StyledButton icon={<UploadOutlined />}>
              Click to upload
            </StyledButton>
          </Upload>
        </Form.Item>
        <Form.Item>
          <StyledButton type="primary" htmlType="submit">
            Update
          </StyledButton>
          <SubmitButton type="default" onClick={onCancel}>
            Cancel
          </SubmitButton>
        </Form.Item>
      </Form>
      <Modal />
    </FormContainer>
  );
};

export default ModifyEventForm;
