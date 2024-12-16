/* AUTH */
export type CreateCandidateAccount = {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type Authentication = {
  email: string;
  password: string;
}

export type AuthJSON = {
  access_token: string
  role: {
    description: string
    name: string
    type: string
  },
  user_id: string
}
