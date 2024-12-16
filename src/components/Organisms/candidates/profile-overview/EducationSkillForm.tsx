import { Box, Button, CircularProgress } from "@mui/material";
import { FormEvent, useState } from "react";
import { EducationFormSchema, EducationFormType, SkillFormSchema, SkillFormType } from "../../../../pages/candidates/types";
import EducationsForm from "./EducationForm";
import SkillsForm from "./SkillForm";
import { DEFAULT_EDUCATION_FORM } from "../../../../pages/candidates/constants";
import { NavigateNextRounded } from "@mui/icons-material";
import RequestAPI from "../../../../services/api/request";
import { GetSession } from "../../../../pages/global-helpers";

export default function EducationSkillForm({
  setCurrentStep,
  setAlert
}: {
  setCurrentStep: React.Dispatch<React.SetStateAction<number | undefined>>
  setAlert: React.Dispatch<React.SetStateAction<{ show: boolean, message: string }>>
}) {
  /* state */
  const [formValue, setFormValue] = useState<{ educations: EducationFormType, skills: { skill_id: number }[] }>({
    educations: [DEFAULT_EDUCATION_FORM],
    skills: [{
      skill_id: 0
    }]
  })
  const [errMsg, setErrMsg] = useState<{ [key: number]: Record<string, string> }>({})
  const [loading, setLoading] = useState<boolean>(false)
  /* onSubmit */
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    const validateEducation = EducationFormSchema.safeParse(formValue.educations)
    if (!validateEducation.success) {
      const errorValidator = validateEducation.error.issues.reduce((prev: any, current) => {
        const [index, field] = current.path
        if (!prev[index]) prev[index] = {};
        prev[index][field] = current.message
        return prev
      }, {})
      setLoading(false)
      setErrMsg(errorValidator)
      setAlert({ show: true, message: "ensure all educations field are valid!" })
      return
    }
    const validateSkill = SkillFormSchema.safeParse(formValue.skills)
    if (!validateSkill.success) {
      const errorValidator = validateSkill.error.issues.reduce((prev: any, current) => {
        const [index, field] = current.path
        if (!prev[index]) prev[index] = {};
        prev[index][field] = current.message
        return prev
      }, {})
      setLoading(false)
      setErrMsg(errorValidator)
      setAlert({ show: true, message: "ensure all skills field are valid!" })
      return
    }

    setErrMsg({})

    const token = GetSession('auth')
    // THE REQUEST API HELPER CLASS DOESNT HAVE ABILITIES TO MAKE REQUEST CONCURRENTLY
    const [success_education, fail_education] = await RequestAPI.JSONRequest<EducationFormType>(formValue.educations).Send<string>("/api/v1/candidates/educations/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    })
    if (fail_education !== undefined) {
      setLoading(false)
      return setAlert({ show: true, message: fail_education.message })
    }
    const [success_skill, fail_skill] = await RequestAPI.JSONRequest<SkillFormType>(formValue.skills)
      .Send<string>("/api/v1/candidates/skills/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        }
      })
    if (fail_skill !== undefined) {
      setLoading(false)
      return setAlert({ show: false, message: fail_skill.message })
    }

    setLoading(false)
    setAlert({ show: true, message: `${success_education} and ${success_skill}` })
    return setTimeout(() => {
      setCurrentStep(prev => prev as number + 1)
    }, 3000)
  }
  return (
    <Box component={"div"}>
      <form onSubmit={onSubmit}>
        <EducationsForm formValue={formValue.educations} setFormValue={setFormValue} errMsg={errMsg} />
        <SkillsForm formValue={formValue.skills} setFormValue={setFormValue} errMsg={errMsg} />
        <Box
          component={"div"}
          sx={{
            marginY: "1.5em",
            display: "flex",
            justifyContent: "end"
          }}
        >
          <Button
            type="submit"
            variant="contained"
            endIcon={loading ? (<CircularProgress color="secondary" size={15} />) : (<NavigateNextRounded />)}
            disabled={loading}
            sx={{
              minWidth: "10em"
            }}
          >
            Next
          </Button>
        </Box>
      </form>
    </Box>
  )
}