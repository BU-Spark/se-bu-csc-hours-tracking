"use client";

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
	Dropdown,
	Row,
	Col,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { Category, Event, Organization } from "@prisma/client";
import { getCategories, getOrganizations } from "../action";
import { useSession } from '@clerk/clerk-react';
import {
	getEvents,
	getEventsByOrganizerId,
	getOrganizationByUserId,
} from "../action";
import { getPersonFromUser } from "@/lib/getPersonFromUser";

dayjs.extend(customParseFormat);

const { TextArea } = Input;
const { Option } = Select;

const FormContainer = styled.div`
  max-width: 800px;
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

interface AdminEventFormProps {
	event?: Event;
	onUpdate: (event: any, isDraft?: boolean) => void;
	onCancel: () => void;
}

type OrgType = {
	id: number;
	name: string;
	nameofservice: string;
	abbreviation: string;
	unit: string | null;
	street: string;
	city: string;
	state: string;
	zipcode: number;
	apt: string | null;
	image: Buffer | null;
	phone_number: string | null;
	email: string;
} | null | undefined;

const CreateEventForm: React.FC<AdminEventFormProps> = ({
	event,
	onUpdate,
	onCancel,
}) => {
	const [form] = Form.useForm();
	const router = useRouter();
	const { session } = useSession();
	const [previewData, setPreviewData] = useState<any | null>(null);
	const [previewVisible, setPreviewVisible] = useState(false);
	const [organizationsDropdown, setOrganizationsDropdown] = useState<any>([]);
	const [organization, setOrganization] = useState<Organization>();
	const [categoryDropdown, setCategoryDropdown] = useState<any>([]);
	const [category, setCategory] = useState<Category>();
	const [userOrg, setUserOrg] = useState<OrgType>();

	useEffect(() => {
		const fetchOrganizations = async () => {
			try {
				const response: Organization[] | undefined = await getOrganizations();
				if (!response) {
					console.error("bad response getting organizations");
					return;
				}

				const items = response.map((org: Organization) => ({
					key: org.id, // Ensure unique key
					label: org.name,
				}));

				const dummyItems: any[] = [
					{
						id: 1,
						name: "Dum",
					},
				];

				setOrganizationsDropdown(items);
			} catch (error) {
				console.error(error);
			}
		};

		const fetchCategories = async () => {
			try {
				const response: Category[] | undefined = await getCategories();
				if (!response) {
					console.error("bad response getting categories");
					return;
				}

				const items = response.map((cat: Category) => ({
					key: cat.id, // Ensure unique key
					label: cat.name,
				}));

				const dummyCategories: any[] = [{ id: 2, name: "thing" }];

				setCategoryDropdown(items);
			} catch (error) {
				console.error(error);
			}
		};

		const fetchUserOrganizaiton = async () => {
			const userId = session?.user.id;
			if (!userId) {
				throw new Error("User not found");
			}
			const org = await getOrganizationByUserId(userId);
			setUserOrg(org);

		}

		fetchOrganizations();
		fetchCategories();
		fetchUserOrganizaiton();
	}, []);

	const handleFinish = async (values: any, isDraft = false) => {
		if (!session?.user?.id) {
			throw new Error('User ID is not available');
		}
		const { id: userId } = await getPersonFromUser(session.user.id);
		const formattedValues = {
			title: values.title,
			...values,
			event_start: values.event_start.toISOString(),
			event_end: values.event_end.toISOString(),
			reg_start: values.reg_start.toISOString(),
			reg_end: values.reg_end.toISOString(),
			image: values.image
				? await convertFileToBase64(values.image[0].originFileObj)
				: event?.image?.toString("base64"),
			category_id: category ? category : 1,
			coordinator_id: Number(userId),
			organization_id: userOrg?.id || 2,
			estimated_participants: parseInt(values.estimated_participants, 10), // Ensure this is an integer
			password: values.password ? values.password : undefined,
		};
		onUpdate(formattedValues, isDraft);
	};

	const handlePreview = async () => {
		try {
			const values = await form.validateFields();
			setPreviewData(values);
			setPreviewVisible(true);
		} catch (error) {
			console.error("Validation failed:", error);
		}
	};

	// fix
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

	return (
		<FormContainer>
			<BackButton onClick={() => router.push("/third-party/my-events")}>
				← Return to My Events
			</BackButton>
			<Form
				form={form}
				layout="vertical"
				onFinish={(values) => handleFinish(values, false)}
				initialValues={
					event
						? {
							...event,
							event_start: dayjs(event.event_start),
							event_end: dayjs(event.event_end),
							reg_start: dayjs(event.reg_start),
							reg_end: dayjs(event.reg_end),
						}
						: {}
				}
			>
				<Row gutter={16}>
					<Col span={6}>
						<Form.Item
							name="title"
							label="Event Title"
							rules={[{ required: true, message: "Please enter the event name" }]}
						>
							<Input />
						</Form.Item>
					</Col>
					<Col span={6}>
						<Form.Item
							name="location"
							label="Event Location"
							rules={[{ required: true, message: "Please enter the location" }]}
						>
							<Input />
						</Form.Item>
					</Col>
					<Col span={6}>
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
									<Select.Option key={item.key} value={item.key}>
										{item.label}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
					</Col>
					<Col span={6}>
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
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={6}>
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
					</Col>
					<Col span={6}>
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
					</Col>
					<Col span={6}>
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
					</Col>
					<Col span={6}>
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
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={6}>
						<Form.Item
							name="transit"
							label="Ideal Transit"
							rules={[{ required: true, message: "Please enter the transit" }]}
						>
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
					<Col span={6}>

					</Col>
					<Col span={6}>

					</Col>
				</Row>
				<Row>
					<Col span={24}>
						<Form.Item
							name="description"
							label="Description"
							rules={[{ required: true, message: "Please enter the description" }]}
						>
							<TextArea rows={4} />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={6}>
						<Form.Item
							name="image"
							label="Image Upload"
							valuePropName="fileList"
							getValueFromEvent={(e) => e.fileList}
							rules={[{ required: true, message: "Please upload an image" }]}
						>
							<Upload listType="picture" beforeUpload={() => false}>
								<StyledButton icon={<UploadOutlined />}>
									Click to upload
								</StyledButton>
							</Upload>
						</Form.Item>
					</Col>
					<Col span={6}>
						<Form.Item label=" ">
							<SubmitButton
								type="primary"
								htmlType="submit"
								onClick={() => handleFinish(form.getFieldsValue(), true)}
							>
								Publish
							</SubmitButton>
							<StyledButton
								type="default"
								style={{ marginLeft: "1rem" }}
								onClick={handlePreview}
							>
								Preview
							</StyledButton>
						</Form.Item>
					</Col>
				</Row>
			</Form>
			<Modal
				title="Event Preview"
				open={previewVisible}
				onCancel={() => setPreviewVisible(false)}
				footer={[
					<Button key="close" onClick={() => setPreviewVisible(false)}>
						Close
					</Button>,
				]}
			>
				{previewData && (
					<div>
						<p>
							<strong>Title:</strong> {previewData.title}
						</p>
						<p>
							<strong>Coordinator Name:</strong> {previewData.coordinator_name}
						</p>
						<p>
							<strong>Coordinator Email:</strong>{" "}
							{previewData.coordinator_email}
						</p>
						<p>
							<strong>Start Date and Time:</strong>{" "}
							{dayjs(previewData.event_start).format("YYYY-MM-DD h:mm a")}
						</p>
						<p>
							<strong>End Date and Time:</strong>{" "}
							{dayjs(previewData.event_end).format("YYYY-MM-DD h:mm a")}
						</p>
						<p>
							<strong>Registration Starts:</strong>{" "}
							{dayjs(previewData.reg_start).format("YYYY-MM-DD h:mm a")}
						</p>
						<p>
							<strong>Registration Ends:</strong>{" "}
							{dayjs(previewData.reg_end).format("YYYY-MM-DD h:mm a")}
						</p>
						<p>
							<strong>Participants:</strong>{" "}
							{previewData.estimated_participants}
						</p>
						<p>
							<strong>Location:</strong> {previewData.location}
						</p>
						<p>
							<strong>Transit:</strong> {previewData.transit}
						</p>
						<p>
							<strong>Description:</strong> {previewData.description}
						</p>
						<p>
							<strong>Image:</strong>{" "}
							<img
								src={`data:image/jpeg;base64,${previewData.image}`}
								alt="Event"
								style={{ width: "100%", height: "auto" }}
							/>
						</p>
					</div>
				)}
			</Modal>
		</FormContainer>
	);
};

export default CreateEventForm;
