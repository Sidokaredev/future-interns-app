import { z } from 'zod'

export const CandidateProfileSchema = z.object({
  id: z.string(),
  expertise: z.string(),
  about_me: z.string(),
  date_of_birth: z.string().datetime({ offset: true }),
  background_profile_image_path: z.string().nullable(),
  profile_image_path: z.string().nullable(),
  cv_document_path: z.string().nullable(),
  /* user */
  user: z.object({
    id: z.string(),
    fullname: z.string(),
    email: z.string(),
  }).nullable().optional(),
  /* address */
  address: z.object({
    id: z.number(),
    street: z.string(),
    neighborhood: z.string(),
    rural_area: z.string(),
    sub_district: z.string(),
    city: z.string(),
    province: z.string(),
    country: z.string(),
    postal_code: z.string(),
  }).nullable().optional(),
  /* educations */
  educations: z.object({
    id: z.number(),
    university: z.string(),
    address: z.string(),
    major: z.string(),
    degree: z.string(),
    is_graduated: z.boolean(),
    start_at: z.string().datetime({ offset: true }),
    end_at: z.string().datetime({ offset: true }).nullable(),
    gpa: z.number().lte(5),
  }).array().optional(),
  /* skills */
  skills: z.object({
    id: z.number(),
    name: z.string(),
    skill_icon_image_path: z.string().nullable()
  }).array().optional(),
  /* experiences */
  experiences: z.object({
    id: z.number(),
    company_name: z.string(),
    position: z.string(),
    type: z.string(),
    location_address: z.string(),
    is_current: z.boolean(),
    start_at: z.string().datetime({ offset: true }),
    end_at: z.string().datetime({ offset: true }),
    description: z.string(),
    attachment_document_path: z.string().nullable(),
  }).array().optional(),
  /* socials */
  socials: z.object({
    id: z.number(),
    name: z.string(),
    url: z.string(),
    icon_image_path: z.string().nullable(),
  }).array().optional(),
})

export type CandidateProfile = z.infer<typeof CandidateProfileSchema>

export const CandidateFormSchema = z.object({
  profile_img: z.union([z.instanceof(File).nullable().optional(), z.string()]),
  background_profile_img: z.union([z.instanceof(File).nullable().optional(), z.string()]),
  cv_document: z.union([z.instanceof(File).nullable().optional(), z.string()]),
  expertise: z.string().min(3),
  date_of_birth: z.string().datetime({ offset: true }),
  about_me: z.string().min(3)
})

export type CandidateFormType = z.infer<typeof CandidateFormSchema>

export const AddressFormSchema = z.object({
  id: z.number().optional(),
  street: z.string().min(3),
  neighborhood: z.string(),
  rural_area: z.string(),
  sub_district: z.string().min(3),
  city: z.string().min(3),
  province: z.string().min(3),
  country: z.string().min(3),
  postal_code: z.number().min(5, { message: "postal code should have five digits number" })
})

export type AddressFormType = z.infer<typeof AddressFormSchema>

export type CandidateAddressFormType = {
  candidate: CandidateFormType,
  address: AddressFormType
}

export const EducationFormSchema = z.object({
  id: z.number().optional(),
  university: z.string().min(3),
  address: z.string().min(3),
  major: z.string().min(3),
  degree: z.string().min(3),
  is_graduated: z.boolean(),
  gpa: z.number().positive().lte(5),
  start_at: z.string().datetime({ offset: true }),
  end_at: z.string().datetime({ offset: true }),
})

export const ArrayEducationFormSchema = EducationFormSchema.array()

export type EducationFormType = z.infer<typeof EducationFormSchema>
export type ArrayEducationFormType = z.infer<typeof ArrayEducationFormSchema>

export const SkillFormSchema = z.object({
  skill_id: z.number().positive({ message: "please choose available skills" })
})
export const ArraySkillFormSchema = SkillFormSchema.array()

export type SkillFormType = z.infer<typeof SkillFormSchema>
export type ArraySkillFormType = z.infer<typeof ArraySkillFormSchema>

export const EducationSkillFormSchema = z.object({
  educations: ArrayEducationFormSchema.nonempty(),
  skills: ArraySkillFormSchema.nonempty()
})

export type EducationSkillFormType = z.infer<typeof EducationSkillFormSchema>

export const ExperienceFormSchema = z.object({
  id: z.number().optional(),
  company_name: z.string().min(3),
  position: z.string().min(3),
  location_address: z.string().min(3),
  type: z.string().min(3),
  is_current: z.boolean(),
  start_at: z.string().datetime({ offset: true }),
  end_at: z.string().datetime({ offset: true }),
  attachment_document: z.instanceof(File).optional(),
  attachment_document_path: z.string().nullable().optional(),
  description: z.string().min(3)
})

export type ExperienceFormType = z.infer<typeof ExperienceFormSchema>

export const SocialFormSchema = z.object({
  social_id: z.number().gt(0, { message: "please choose the available socials" }),
  url: z.string().url()
})
// .array().nonempty()

export type SocialFormType = z.infer<typeof SocialFormSchema>

export type ProfileType = {
  id: string,
  expertise: string,
  profile_image_path: string,
  background_profile_image_path: string,
  about_me: string,
  user: {
    id: string,
    fullname: string,
    email: string,
  }
}

export type UserDataType = {
  id: string,
  fullname: string,
  email: string,
}

export type CandidateProfileDataType = {
  id: string,
  expertise: string,
  about_me: string,
  date_of_birth: string,
  background_profile_image_path: string,
  profile_image_path: string,
  cv_document_path: string,
}

export type EducationDataType = {
  id: number,
  university: string,
  address: string,
  major: string,
  degree: string,
  is_graduated: boolean,
  start_at: string,
  end_at: string,
  gpa: number
}

export type SkillDataType = {
  id: number,
  name: string,
  skill_icon_image_path: string
}

export type ExperienceDataType = {
  id: number,
  company_name: string,
  position: string,
  location_address: string,
  type: string,
  is_current: boolean,
  start_at: string,
  end_at: string,
  attachment_document_path: string,
  description: string
}

export type AddressDataType = {
  id: number,
  street: string,
  neighborhood: string,
  rural_area: string,
  sub_district: string
  city: string,
  province: string,
  country: string,
  postal_code: number,
}

export type SocialDataType = {
  id: number | undefined,
  name: string,
  icon_image_path: string,
  url: string
}

export type AppliedVacancy = {
  pipeline_id: string;
  stage: string;
  status: string;
  created_at: string;
  updated_at: string;
  vacancy: {
    id: string;
    position: string;
    description: string;
    qualification: string;
    responsibility: string;
    salary: number;
    is_inactive: boolean;
  };
  employer: {
    id: string;
    name: string;
    legal_name: string;
    location: string;
    profile_image_path: string;
  };
};

export type ApplicantAssessment = {
  assessment_id: number;
  name: string;
  note: string;
  assessment_link: string;
  start_at: string;
  due_date: string;
  submission_status: string;
  submission_result: number | null;
  assessment_documents: {
    id: number;
    assessment_document_path: string;
    name: string;
    size: number;
  }[];
  assessment_submissions: {
    id: number;
    submission_document_path: string;
    name: string;
  }[];
};

export type ApplicantUnscheduled = {
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

export type ApplicantInterview = {
  id: number;
  date: string;
  location: string;
  location_url: string;
  status: string;
  result: string | null;
};

export type ApplicantOffer = {
  id: number;
  end_on: string;
  status: string;
  loa_document_path: string | null;
};

export type ApplicationOffer = {
  offering_id: number;
  loa_document_path: string | null;
  document: {
    id: number | null;
    name: string | null;
  };
  vacancy: {
    id: string;
    position: string;
    employer: {
      id: string;
      name: string;
      legal_name: string;
    };
  };
}