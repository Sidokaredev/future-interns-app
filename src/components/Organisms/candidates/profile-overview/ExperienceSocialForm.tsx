import { Box, Button, CircularProgress } from "@mui/material";
import ExperiencesForm from "./ExperienceForm";
import SocialsForm from "./SocialForm";
import { VerifiedUserRounded } from "@mui/icons-material";
import React, { FormEvent, useState } from "react";
import { ExperienceFormSchema, ExperienceFormType, SocialFormType } from "../../../../pages/candidates/types";
import { DEFAULT_EXPERIENCE_FORM } from "../../../../pages/candidates/constants";
import { GetSession } from "../../../../pages/global-helpers";
import RequestAPI from "../../../../services/api/request";

export default function ExperienceSocialForm({
  setAlert,
  setCurrentStep,
  setDataAction,
}: {
  setAlert: React.Dispatch<React.SetStateAction<{ show: boolean, message: string }>>
  setCurrentStep: React.Dispatch<React.SetStateAction<number | undefined>>
  setDataAction: React.Dispatch<React.SetStateAction<boolean>>
}) {
  /* state */
  const [formValue, setFormValue] = useState<{ experience: ExperienceFormType, socials: SocialFormType[] }>({
    experience: DEFAULT_EXPERIENCE_FORM,
    socials: []
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [errMsg, setErrMsg] = useState<Record<string, string | string[]>>({})
  /* onSubmit */
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    const validate = ExperienceFormSchema.safeParse(formValue.experience)
    if (!validate.success) {
      setLoading(false)
      const errMsg = validate.error.flatten().fieldErrors
      setErrMsg(errMsg)
      setAlert({ show: true, message: "please follow form validation rules!" })
      return
    }
    setErrMsg({})

    const token = GetSession("auth")

    const [success_experience, fail_experience] = await RequestAPI.FormDataRequest(formValue.experience).Send<{
      attachment_document_status: string,
      message: string
    }>("/api/v1/candidates/experiences/", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token,
      }
    })
    if (fail_experience !== undefined) {
      setLoading(false)
      setAlert({ show: true, message: fail_experience.message })
      return
    }

    const [success_social, fail_social] = await RequestAPI.JSONRequest(formValue.socials)
      .Send<string>("/api/v1/candidates/socials/", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token,
        }
      })
    if (fail_social !== undefined) {
      setLoading(false)
      setAlert({ show: true, message: fail_social.message })
      return
    }

    setLoading(false)
    setAlert({ show: true, message: `${success_experience?.message} and ${success_social}` })
    setDataAction(prev => !prev)
    return setTimeout(() => {
      setCurrentStep(undefined)
    }, 3000)
  }
  return (
    <Box component={"div"}
    >
      <form onSubmit={onSubmit}>
        <ExperiencesForm formValue={formValue.experience} setFormValue={setFormValue} errMsg={errMsg} />
        <SocialsForm formValue={formValue.socials} setFormValue={setFormValue} />
        <Box component={"div"}
          sx={{
            display: "flex",
            justifyContent: "end"
          }}
        >
          <Button
            type="submit"
            variant="contained"
            size="small"
            endIcon={loading ? (<CircularProgress color="secondary" size={15} />) : (<VerifiedUserRounded />)}
            disabled={loading}
            sx={{
              minWidth: "10em",
            }}
          >
            Finish
          </Button>
        </Box>
      </form>
    </Box>
  )
}