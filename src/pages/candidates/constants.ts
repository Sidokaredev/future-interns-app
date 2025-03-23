export const Provinces: string[] = [
  "Aceh",
  "Bali",
  "Banten",
  "Bengkulu",
  "Daerah Istimewa Yogyakarta",
  "Daerah Khusus Ibukota Jakarta",
  "Gorontalo",
  "Jambi",
  "Jawa Barat",
  "Jawa Tengah",
  "Jawa Timur",
  "Kalimantan Barat",
  "Kalimantan Selatan",
  "Kalimantan Tengah",
  "Kalimantan Timur",
  "Kalimantan Utara",
  "Kepulauan Bangka Belitung",
  "Kepulauan Riau",
  "Lampung",
  "Maluku",
  "Maluku Utara",
  "Nusa Tenggara Barat",
  "Nusa Tenggara Timur",
  "Papua",
  "Papua Barat",
  "Papua Barat Daya",
  "Papua Pegunungan",
  "Papua Selatan",
  "Papua Tengah",
  "Riau",
  "Sulawesi Barat",
  "Sulawesi Selatan",
  "Selawesi Tengah",
  "Sulawesi Tenggara",
  "Sulawesi Utara",
  "Sumatera Barat",
  "Sumatera Selatan",
  "Sumatera Utara"
]

export const Countries = [
  {
    name: "Indonesia",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Flag_of_Indonesia.png",
  }
]

export const DEFAULT_CANDIDATE_FORM = {
  expertise: '',
  date_of_birth: '',
  about_me: '',
}

export const DEFAULT_ADDRESS_FORM = {
  street: '',
  neighborhood: '',
  rural_area: '',
  sub_district: '',
  city: '',
  province: '',
  country: '',
  postal_code: 0,
}

export const DEFAULT_EDUCATION_FORM = {
  university: "",
  address: "",
  major: "",
  degree: "",
  is_graduated: true,
  start_at: "",
  end_at: "",
  gpa: 0
}

export const DEFAULT_EXPERIENCE_FORM = {
  company_name: "",
  position: "",
  location_address: "",
  type: "",
  is_current: false,
  start_at: "",
  end_at: "",
  attachment_document: undefined,
  description: ""
}

export const DEFAULT_SOCIAL_FORM = {
  social_id: 0,
  url: ""
}

export const DEGREE_LIST = [
  "SMA/SMK",
  "Associate's Degree (D3)",
  "Bachelor's Degree (S1/D4)",
  "Master's Degree (S2)",
  "Doctoral Degree / Ph.D. (S3)",
];

export const jobTypes = [
  "Staff",
  "Contract",
  "Freelance",
  "Internship",
];