import { FormCode, HourSubmission, Reason, Role, Event } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";
import { Buffer } from "buffer";

export interface FormRowParams {
  form: Form;
  codes: any;
  isFirst: boolean;
}
export interface Form {
  id: number;
  type: number;
  file: string;
  student_id?: number | null;
}
export interface Code {
  id: number;
  title: string;
  description: string;
  downloadable: boolean;
  upload_link?: string | null;
}

export interface CompleteFormParams {
  title: string;
  description: string;
  downloadable: boolean;
  upload_link?: string | null;
}

export interface CompleteForm {
  id: number;
  title: string;
  description: string;
  file: string;
  student_id?: number | null;
  downloadable: boolean;
  upload_link?: string | null;
}

export interface EventCardProps {
  event_id: number;
  title: string;
  coordinator_id: number;
  category_id: number;
  location: string;
  image: string;
  reg_start: Date;
  reg_end: Date;
  hasPassword: boolean;
  isAdmin?: boolean;
}

export interface EventInput {
  title: string;
  event_start: Date;
  event_end: Date;
  reg_start: Date;
  reg_end: Date;
  estimated_participants: number;
  location: string;
  transit: string;
  description: string;
  form_id: number | null;
  image: string;
}

export interface CardGridProps {
  events: Event[];
  filter: number | Date;
  myEvents: Event[] | undefined;
  view: string;
  pastEvents: boolean | undefined;
}

export interface Person {
  id: number;
  name: string;
  email: string;
  phone_number: string | null;
  bu_id: string;
  role: Role;
  class?: number;
  affiliation_id?: number;
  image?: string;
}

export interface GroupedEvents {
  [date: string]: Event[];
}

export interface EventImage {
  data: ArrayBuffer;
}
export interface EventHours {
  id: number;
  image: string;
  eventName: string;
  organization: string;
  location: string;
  date: string;
  reviewer: string | number;
  hours: number;
  description: string;
  feedback: string;
  approval_status: number;
}

export interface CreateNewHourSubmissionParams {
  eventId: number;
  userId: number;
  hours: number;
  feedback: string;
  description: string;
}

export interface HoursTableData {
  key: React.Key;
  submissionId: string;
  studentName: string;
  college: string;
  category: string;
  dateSubmitted: Date;
  description: string;
  hours: number;
  approvalStatus: number;
  updatedBy: string;
}

export interface EventApplicationsTableData {
  key: React.Key;
  applicationId: string;
  approvalStatus: number;
  dateApplied: Date;
  updatedBy: string;
  reason: Reason;
  studentName: string;
  class: number;
  college: string;
  eventId: string;
  eventTitle: string;
  estimatedParticipants: number;
}

export interface EventApplicationTableParams {
  data: EventApplicationsTableData[] | null;
  set1: Dispatch<SetStateAction<EventApplicationsTableData[]>> | undefined;
  val1: EventApplicationsTableData[] | undefined;
  set2: Dispatch<SetStateAction<EventApplicationsTableData[]>> | undefined;
  val2: EventApplicationsTableData[] | undefined;
}

export interface CustomTableParams {
  data: HoursTableData[] | null;
  set1: Dispatch<SetStateAction<HoursTableData[]>> | undefined;
  val1: HoursTableData[] | undefined;
  set2: Dispatch<SetStateAction<HoursTableData[]>> | undefined;
  val2: HoursTableData[] | undefined;
}

export interface ProcessSubmissionParams {
  submissionId: number;
  updaterId: number;
  approvalStatus: number;
}

export interface SpotsLeftProps {
  eventId: number;
}

export interface StudentDropdown {
  record: HoursTableData;
}

export interface NewForm {
  title: string;
  description: string;
  uploadLink: string;
  fileLink: string;
}

export interface CreateFormResponse {
  newForm: Form;
  newFormCode: FormCode;
}

export interface Author {
  id: number;
  name: string;
}

export interface Feedback {
  id: number;
  author: Author;
  event: Event;
  content: string | null;
  dateWritten: Date;
}