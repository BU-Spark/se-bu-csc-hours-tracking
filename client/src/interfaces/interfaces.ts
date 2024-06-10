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
