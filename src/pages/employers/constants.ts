import { AssessmentFormType, EmployerProfileFormType, HeadquarterFormType, VacancyFormType } from "./types";

export const LINE_INDUSTRY = [
  "IT and Technology",
  "Finance",
  "Construction and Real Estate",
  "Insurance",
  "Retail and E-commerce",
  "Entertainment and Media",
  "Transportation and Logistics",
  "Telecommunications",
  "Education",
  "Legal Services",
];

export const EMPLOYEE_TYPE = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
  "Temporary",
  "Volunteer",
  "Remote",
  "On-call",
  "Seasonal",
];

export const WORK_ARRANGEMENT = [
  "On-site",
  "Remote",
  "Hybrid (On-site & Remote)",
  "Flexible Hours",
  "Shift-based",
  "Compressed Workweek",
  "Freelance/Project-based",
  "Rotational"
];

export const MIN_EXPERIENCE = [
  "No experience required",
  "Less than 1 year",
  "1-2 years",
  "3-5 years",
  "6-10 years",
  "More than 10 years"
];

export const DEFAULT_EMPLOYER_FORM: EmployerProfileFormType = {
  name: "",
  legal_name: "",
  location: "",
  founded: 0,
  founder: "",
  total_of_employee: "",
  website: "",
  description: "",
};

export const DEFAULT_HEADQUARTER_FORM: HeadquarterFormType = {
  name: "",
  type: "",
  street: "",
  neighborhood: "",
  rural_area: "",
  sub_district: "",
  city: "",
  province: "",
  country: "",
  postal_code: 0
};

export const DEFAULT_VACANCY_FORM: VacancyFormType = {
  position: "",
  description: "",
  qualification: "",
  responsibility: "",
  line_industry: "",
  employee_type: "",
  min_experience: "",
  work_arrangement: "",
  salary: 0,
  is_inactive: false,
  sla: 168
};

export const DEFAULT_ASSESSMENT_FORM: AssessmentFormType = {
  name: "",
  note: "",
  start_at: "",
  due_date: "",
  vacancy_id: "",
  assessment_link: "",
  assessment_documents: []
};

export const DEFAULT_INTERVIEW_FORM = {
  date: "",
  location: "",
  location_url: "",
  status: "Scheduled",
  result: null,
  pipeline_id: "",
  vacancy_id: "",
}