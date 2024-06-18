import { Role } from "@prisma/client";

export interface FormRowParams {
  form: Form;
  codes: any;
  isFirst: boolean;
}
export interface Form {
  id: number;
  type: number;
  file: String;
  student_id?: number | null;
}
export interface Code {
  id: number;
  title: String;
  description: String;
  downloadable: boolean;
  upload_link?: String | null;
}

export interface CompleteFormParams {
  title: String;
  description: String;
  downloadable: boolean;
  upload_link?: String | null;
}

export interface CompleteForm {
  id: number;
  title: String;
  description: String;
  file: String;
  student_id?: number | null;
  downloadable: boolean;
  upload_link?: String | null;
}

export interface Event {
  id: number;
  title: String;
  event_start: Date;
  event_end: Date;
  reg_start: Date;
  reg_end: Date;
  estimated_participants: number;
  location: String;
  transit: String;
  description: String;
  category_id: number;
  coordinator_id: number;
  form_id: number | null;
  organization_id: number;
  image: Buffer;
}

export interface EventCardProps {
  event_id: number;
  title: String;
  coordinator_id: number;
  category_id: number;
  location: String;
  image: string;
  event_start: Date;
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
}

export interface Person {
  id: number;
  name: string;
  email: string;
  phone_number?: string | null;
  role: Role;
  class?: number;
  affiliation_id?: number;
  image?: string;
}
// export enum Role {
//   USER,
//   ORGANIZER,
// }

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
  status: string;
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