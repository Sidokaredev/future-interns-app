import { z } from "zod"

export const EmployerProfileFormSchema = z.object({
  name: z.string().min(3),
  legal_name: z.string().min(3),
  location: z.string().min(3),
  founded: z.number().positive(),
  founder: z.string().min(3),
  total_of_employee: z.string().min(3),
  website: z.string().url(),
  description: z.string().min(3),
  background_profile_image: z.union([z.instanceof(File).nullable().optional(), z.string()]),
  profile_image: z.union([z.instanceof(File).nullable().optional(), z.string()])
});

export type EmployerProfileFormType = z.infer<typeof EmployerProfileFormSchema>;

export const HeadquarterFormSchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string().min(3),
  type: z.string().min(3),
  street: z.string().min(3),
  neighborhood: z.string(),
  rural_area: z.string(),
  sub_district: z.string().min(3),
  city: z.string().min(3),
  province: z.string().min(3),
  country: z.string().min(3),
  postal_code: z.number().positive(),
});

export type HeadquarterFormType = z.infer<typeof HeadquarterFormSchema>;

export type HeadquarterType = {
  name: string;
  type: string;
  address: {
    id: number;
    street: string;
    neighborhood: string;
    rural_area: string;
    sub_district: string;
    city: string;
    province: string;
    country: string;
    postal_code: number;
  };
}

export type EmployerType = EmployerProfileFormType & {
  background_profile_image_path?: string | null;
  profile_image_path?: string | null;
};

export type OfficeImageType = {
  name: string;
  image_path: string;
};

export const VacancyFormSchema = z.object({
  position: z.string().min(3),
  description: z.string().min(3),
  qualification: z.string().min(3),
  responsibility: z.string().min(3),
  line_industry: z.string().min(3),
  employee_type: z.string().min(3),
  min_experience: z.string().min(3),
  salary: z.number().positive(),
  work_arrangement: z.string().min(3),
  is_inactive: z.boolean(),
  sla: z.number(),
});

export type VacancyFormType = z.infer<typeof VacancyFormSchema>;

export type VacancyType = {
  id: string;
  position: string;
  description: string;
  qualification: string;
  responsibility: string;
  line_industry: string;
  employee_type: string;
  min_experience: string;
  salary: number;
  work_arrangement: string;
  is_inactive: boolean;
  sla: number;
  created_at: string;
  employer: {
    name: string;
    legal_name: string;
    location: string;
    profile_image_path: string;
  }
};

export type ApplicantScreening = {
  pipeline_id: string;
  candidate_id: string;
  fullname: string;
  email: string;
  profile_image_path: string;
  expertise: string;
  education: {
    university: string;
    degree: string;
    major: string;
  };
  socials: {
    name: string;
    url: string;
    icon_image_path: string;
  }[];
}

// export type ApplicantAsessment = {
//   pipeline_id: string;
//   candidate_id: string;
//   candidate: {
//     id: string;
//     expertise: string;
//     profile_image_path: string;
//     fullname: string;
//     email: string;
//   };
// };

export const AssessmentFormSchema = z.object({
  id: z.number().positive().nullable().optional(),
  name: z.string().min(3),
  note: z.string().min(3),
  assessment_link: z.string().nullable().optional(),
  start_at: z.string().datetime({ offset: true }),
  due_date: z.string().datetime({ offset: true }),
  vacancy_id: z.string().min(3),
  assessment_documents: z.instanceof(File).array(),
  current_assessment_documents: z.object({
    id: z.number().positive(),
    name: z.string(),
    assessment_document_path: z.string()
  }).array().optional(),
  // assessment_documents: z.union([z.instanceof(File).array(), z.object({
  //   id: z.number().positive(),
  //   name: z.string().min(3),
  //   assessment_document_path: z.string().min(3),
  // }).array(),
  // ])
});

export type AssessmentFormType = z.infer<typeof AssessmentFormSchema>;

export const AssessmentAssignessFormSchema = z.object({
  assessment_id: z.string().min(3),
  pipeline_id: z.string().min(3),
});

export type AssessmentAssignessFormSchema = z.infer<typeof AssessmentAssignessFormSchema>;

export type AssessmentType = {
  id: number;
  name: string;
  note: string;
  assessment_link?: string;
  start_at: string;
  due_date: string;
  assessment_assignees: {
    pipeline: {
      id: string;
      stage: string;
    };
    candidate: {
      id: string;
      expertise: string;
      profile_image_path: string;
      user: {
        id: string;
        email: string;
        fullname: string;
      };
    };
    submission_status: string;
    submission_result: number | null;
    submission_documents: {
      id: number;
      name: string;
      submission_document_path: string;
    }[];
  }[];
  assessment_documents: {
    id: number;
    name: string;
    assessment_document_path: string;
  }[];
};

export type AssessmentApplicant = {
  pipeline_id: string;
  candidate: {
    id: string;
    expertise: string;
    profile_image_path: string;
    user: {
      id: string;
      email: string;
      fullname: string;
    };
  };
};

export type AssignedApplicant = AssessmentApplicant
export type UnassignedApplicant = AssessmentApplicant

export type AssessmentAssigneeType = {
  pipeline: {
    id: string;
    stage: string;
  };
  candidate: {
    id: string;
    expertise: string;
    profile_image_path: string;
    user: {
      id: string;
      email: string;
      fullname: string;
    };
  };
  submission_status: string;
  submission_result: number | null;
  submission_documents: {
    id: number;
    name: string;
    submission_document_path: string;
  }[];
};

export const InterviewFormSchema = z.object({
  id: z.number().positive().nullable().optional(),
  date: z.string().datetime({ offset: true }),
  location: z.string().min(3),
  location_url: z.string().url(),
  status: z.string(),
  result: z.string().nullable(),
  pipeline_id: z.string().min(3),
  vacancy_id: z.string().min(3),
});

export type InterviewFormType = z.infer<typeof InterviewFormSchema>;

export type UnscheduledApplicant = {
  id: string;
  stage: string;
  candidate: {
    id: string;
    profile_image_path: string;
    user: {
      id: string;
      fullname: string;
      email: string;
    };
  };
};

export type LatestInterviewApplicant = {
  id: string;
  stage: string;
  candidate: {
    id: string;
    profile_image_path: string;
    user: {
      id: string;
      fullname: string;
      email: string;
    };
  };
  interview: {
    id: number;
    date: string;
    location: string;
    location_url: string;
    status: string;
    result: string;
  };
};

export type ScheduledInterview = {
  id: number;
  date: string;
  location: string;
  location_url: string;
  status: string;
  result: string;
};

export type ApplicantUnoffered = {
  id: string;
  stage: string;
  status: string;
  candidate: {
    id: string;
    profile_image_path: string;
    user: {
      id: string;
      fullname: string;
      email: string;
    };
  };
};

export type ApplicantOffered = {
  id: string;
  stage: string;
  status: string;
  candidate: {
    id: string;
    profile_image_path: string;
    user: {
      id: string;
      fullname: string;
      email: string;
    };
  };
  offering: {
    id: number;
    end_on: string;
    status: string;
    loa_document: {
      id: number | null;
      name: string | null;
      loa_document_path: string;
    };
  };
};