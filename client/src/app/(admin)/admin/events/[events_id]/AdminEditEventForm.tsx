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
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { Category, Event, Organization, Person } from "@prisma/client";
import { getCoordinatorById } from "@/components/EventCard/action";
import { getCategories, getOrganizations } from "./action";

const { RangePicker } = DatePicker;
const { Option } = Select;

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

interface CoordinatorInput {
  name: string;
  email: string;
}

const AdminEditEventForm: React.FC<AdminEditEventFormProps> = ({
  event,
  onUpdate,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [coordinator, setCoordinator] = useState<CoordinatorInput>();
  const router = useRouter();

  useEffect(() => {
    fetchCoordinator();
    fetchCategories();
    fetchOrganizations();
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      "coordinator.name": coordinator?.name,
      "coordinator.email": coordinator?.email,
      category: event.category_id,
      organizations: event.organization_id,
      ...event,
      dates: [dayjs(event.event_start), dayjs(event.event_end)],
      registrationDates: [dayjs(event.reg_start), dayjs(event.reg_end)],
      image: event.image,
    });
  }, [event, form, coordinator]);

  const fetchCoordinator = async () => {
    try {
      const coordinatorResponse: Person | undefined = await getCoordinatorById(
        event.coordinator_id
      );
      if (!coordinatorResponse) {
        console.error("bad coordinatorResponse");
        return;
      }
      const coordinator: CoordinatorInput = {
        name: coordinatorResponse.name,
        email: coordinatorResponse.email,
      };
      setCoordinator(coordinator);
    } catch (error) {
      console.error(error);
    }
  };

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

  const bufferToUploadFile = (buffer: Buffer): UploadFile => {
    const file = new File([buffer], "image.png", { type: "image/png" });
    return {
      uid: "-1", // Unique identifier for the file
      lastModifiedDate: new Date(),
      name: "image.png",
      status: "done", // Status of the upload, 'done' indicates uploaded successfully
      url: URL.createObjectURL(file), // URL to display the image
      originFileObj: file as RcFile, // Assigning RcFile to originFileObj
    };
  };

  const handleFinish = (values: any) => {
    const updatedEvent: Event = {
      ...event,
      ...values,
      event_start: values.dates[0].toDate(),
      event_end: values.dates[1].toDate(),
      reg_start: values.registrationDates[0].toDate(),
      reg_end: values.registrationDates[1].toDate(),
    };
    onUpdate(updatedEvent);
  };

  return (
    <FormContainer>
      <BackButton onClick={onCancel}>Back</BackButton>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          ...event,
          "coordinator.name": coordinator?.name,
          "coordinator.email": coordinator?.email,
          estimatedParticipants: event.estimated_participants,
          category: event.category_id,
          organization: event.organization_id,

          dates: [dayjs(event.event_start), dayjs(event.event_end)],
          registrationDates: [dayjs(event.reg_start), dayjs(event.reg_end)],
          image: event.image,
        }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please enter the event title" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="coordinator.name"
          label="Coordinator Name"
          rules={[
            { required: true, message: "Please enter the coordinator name" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="coordinator.email"
          label="Coordinator Email"
          rules={[
            {
              required: true,
              message: "Please enter the coordinator email",
              type: "email",
            },
          ]}
        >
          <Input />
        </Form.Item>
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
        <Form.Item
          name="organization"
          label="Organization"
          rules={[{ required: true, message: "Please select an organization" }]}
        >
          <Select>
            {organizations.map((organization) => (
              <Option key={organization.id} value={organization.id}>
                {organization.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="dates"
          label="Event Dates"
          rules={[{ required: true, message: "Please select the event dates" }]}
        >
          <RangePicker showTime />
        </Form.Item>
        <Form.Item
          name="registrationDates"
          label="Registration Dates"
          rules={[
            { required: true, message: "Please select the registration dates" },
          ]}
        >
          <RangePicker showTime />
        </Form.Item>
        <Form.Item
          name="estimatedParticipants"
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
        <Form.Item
          name="location"
          label="Location"
          rules={[
            { required: true, message: "Please enter the event location" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="transit" label="Transit">
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[
            { required: true, message: "Please enter the event description" },
          ]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="image"
          label="Image Upload"
          valuePropName="fileList2"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
          rules={[{ required: true, message: "Please upload an image" }]}
        >
          <Upload
            listType="picture"
            beforeUpload={() => false}
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

export default AdminEditEventForm;
