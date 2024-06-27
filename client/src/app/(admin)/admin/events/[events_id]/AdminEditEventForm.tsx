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
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { Category, Event, Organization } from "@prisma/client";
import { getCategories, getOrganizations } from "../[events_id]/action";

dayjs.extend(customParseFormat);

const { TextArea } = Input;
const { Option } = Select;

const FormContainer = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const BackButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 20px;
  color: #cc0000;

  &:hover {
    color: #ff0000;
  }

  svg {
    margin-right: 8px;
  }
`;

const StyledButton = styled(Button)`
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  background-color: rgba(204, 0, 0, 1);
  color: #fff;
  &:hover {
    background-color: rgba(153, 0, 0, 1) !important;
    color: #fff !important;
  }
`;

const SubmitButton = styled(StyledButton)``;

interface AdminEditEventFormProps {
  event: Event; // Ensure event is required for editing
  onUpdate: (event: any, isDraft?: boolean) => void;
  onCancel: () => void;
}

const AdminEditEventForm: React.FC<AdminEditEventFormProps> = ({
  event,
  onUpdate,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [organizationsDropdown, setOrganizationsDropdown] = useState<any>([]);
  const [organization, setOrganization] = useState<Organization>();
  const [categoryDropdown, setCategoryDropdown] = useState<any>([]);
  const [category, setCategory] = useState<Category>();

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response: Organization[] | undefined = await getOrganizations();
        if (!response) {
          console.error("Bad response getting organizations");
          return;
        }

        const items = response.map((org: Organization) => ({
          key: `org-${org.id}${100 * Math.random()}`, // Ensure unique key
          label: org.name,
        }));

        setOrganizationsDropdown(items);

        // Set initial organization if event has one
        if (event?.organization_id) {
          const initialOrg = response.find(
            (org) => org.id === event.organization_id
          );
          setOrganization(initialOrg);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response: Category[] | undefined = await getCategories();
        if (!response) {
          console.error("Bad response getting categories");
          return;
        }

        const items = response.map((cat: Category) => ({
          key: `cat-${cat.id}-${100 * Math.random()}`, // Ensure unique key
          label: cat.name,
        }));

        setCategoryDropdown(items);

        // Set initial category if event has one
        if (event?.category_id) {
          const initialCat = response.find(
            (cat) => cat.id === event.category_id
          );
          setCategory(initialCat);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrganizations();
    fetchCategories();
  }, [event]);

  const handleFinish = async (values: any, isDraft = false) => {
    const formattedValues = {
      ...values,
      event_start: values.event_start.toISOString(),
      event_end: values.event_end.toISOString(),
      reg_start: values.reg_start.toISOString(),
      reg_end: values.reg_end.toISOString(),
      category_id: category ? category.id : event.category_id, // Use existing category if not changed
      organization_id: organization ? organization.id : event.organization_id, // Use existing org if not changed
      estimated_participants: parseInt(values.estimated_participants, 10), // Ensure this is an integer
    };

    onUpdate(formattedValues, isDraft);
  };

  return (
    <FormContainer>
      <BackButton onClick={() => router.push("/admin/events")}>
        ← Return to Events Page
      </BackButton>
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => handleFinish(values, false)}
        initialValues={{
          ...event,
          event_start: dayjs(event.event_start),
          event_end: dayjs(event.event_end),
          reg_start: dayjs(event.reg_start),
          reg_end: dayjs(event.reg_end),
        }}
      >
        <Form.Item
          name="title"
          label="Event Title"
          rules={[{ required: true, message: "Please enter the event name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="coordinator_name"
          label="Coordinator Name"
          rules={[
            { required: true, message: "Please enter the coordinator name" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="coordinator_email"
          label="Coordinator Email"
          rules={[
            { required: true, message: "Please enter the coordinator email" },
          ]}
        >
          <Input type="email" />
        </Form.Item>
        <Form.Item
          name="category_id"
          label="Category"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select
            placeholder="Select a category"
            onChange={(value) => setCategory(value)}
          >
            {categoryDropdown.map((item: any) => (
              <Option key={item.key} value={item.key}>
                {item.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="organization_id"
          label="Organization"
          rules={[{ required: true, message: "Please select an organization" }]}
        >
          <Select
            placeholder="Select an organization"
            onChange={(value) => setOrganization(value)}
          >
            {organizationsDropdown.map((item: any) => (
              <Option key={item.key} value={item.key}>
                {item.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="event_start"
          label="Start Date and Time"
          rules={[
            { required: true, message: "Please select start date and time" },
          ]}
        >
          <DatePicker
            showTime={{ use12Hours: true, format: "h:mm a" }}
            format="YYYY-MM-DD h:mm a"
          />
        </Form.Item>
        <Form.Item
          name="event_end"
          label="End Date and Time"
          rules={[
            { required: true, message: "Please select end date and time" },
          ]}
        >
          <DatePicker
            showTime={{ use12Hours: true, format: "h:mm a" }}
            format="YYYY-MM-DD h:mm a"
          />
        </Form.Item>
        <Form.Item
          name="reg_start"
          label="Registration Starts"
          rules={[
            {
              required: true,
              message: "Please select registration start date and time",
            },
          ]}
        >
          <DatePicker
            showTime={{ use12Hours: true, format: "h:mm a" }}
            format="YYYY-MM-DD h:mm a"
          />
        </Form.Item>
        <Form.Item
          name="reg_end"
          label="Registration Ends"
          rules={[
            {
              required: true,
              message: "Please select registration end date and time",
            },
          ]}
        >
          <DatePicker
            showTime={{ use12Hours: true, format: "h:mm a" }}
            format="YYYY-MM-DD h:mm a"
          />
        </Form.Item>
        <Form.Item
          name="estimated_participants"
          label="Projected Participants"
          rules={[
            {
              required: true,
              message: "Please enter the number of participants",
            },
          ]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          name="location"
          label="Event Location"
          rules={[{ required: true, message: "Please enter the location" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="transit"
          label="Ideal Transit"
          rules={[{ required: true, message: "Please enter the transit" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter the description" }]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="image"
          label="Image Upload"
          valuePropName="fileList"
          getValueFromEvent={(e) =>
            Array.isArray(e) ? e.map((file) => file.originFileObj) : []
          }
          rules={[{ required: true, message: "Please upload an image" }]}
        >
          <Upload listType="picture" beforeUpload={() => false}>
            <StyledButton icon={<UploadOutlined />}>
              Click to upload
            </StyledButton>
          </Upload>
        </Form.Item>
        <Form.Item>
          <SubmitButton
            type="primary"
            htmlType="submit"
            onClick={() => handleFinish(form.getFieldsValue(), false)}
          >
            Update
          </SubmitButton>
          <StyledButton
            type="default"
            style={{ marginLeft: "1rem" }}
            onClick={onCancel}
          >
            Cancel
          </StyledButton>
        </Form.Item>
      </Form>
      <Modal
        title="Event Preview"
        visible={false} // This should be handled differently for editing
        onCancel={() => {}}
        footer={[
          <Button key="close" onClick={() => {}}>
            Close
          </Button>,
        ]}
      >
        {/* Content for event preview */}
      </Modal>
    </FormContainer>
  );
};

export default AdminEditEventForm;
