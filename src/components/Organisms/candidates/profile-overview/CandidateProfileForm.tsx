import { Box, Button, CircularProgress } from "@mui/material";
import React, { FormEvent, useState } from "react";
import CandidateForm from "./CandidateForm";
import AddressForm from "./AddressForm";
import { AddressFormSchema, AddressFormType, CandidateFormSchema, CandidateFormType } from "../../../../pages/candidates/types";
import { DEFAULT_ADDRESS_FORM, DEFAULT_CANDIDATE_FORM } from "../../../../pages/candidates/constants";
import { NavigateNextRounded } from "@mui/icons-material";
import RequestAPI from "../../../../services/api/request";
import { GetSession } from "../../../../pages/global-helpers";

export default function CandidateProfileForm({
  setCurrentStep,
  setAlert
}: {
  setCurrentStep: React.Dispatch<React.SetStateAction<number | undefined>>,
  setAlert: React.Dispatch<React.SetStateAction<{ show: boolean, message: string }>>
}) {
  /* state */
  const [formValue, setFormValue] = useState<{ candidate: CandidateFormType, address: AddressFormType }>({
    candidate: DEFAULT_CANDIDATE_FORM,
    address: DEFAULT_ADDRESS_FORM
  })
  const [errMsg, setErrMsg] = useState<{ [key: string]: string[] }>({})
  const [loading, setLoading] = useState<boolean>(false)
  /* onSubmit */
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    const validateCandidate = CandidateFormSchema.safeParse(formValue.candidate)
    const validateAddress = AddressFormSchema.safeParse(formValue.address)
    if (!validateCandidate.success) {
      const errorCandidate = validateCandidate.error?.flatten().fieldErrors
      setErrMsg(prev => ({
        ...prev,
        ...errorCandidate
      }))
    }

    if (!validateAddress.success) {
      setLoading(false)
      const errorAddress = validateAddress.error?.flatten().fieldErrors
      return setErrMsg(prev => ({
        ...prev,
        ...errorAddress
      }))
    }
    setErrMsg({})

    const token = GetSession('auth')
    const [data_candidate, fail_candidate] = await RequestAPI.FormDataRequest<CandidateFormType>(formValue.candidate)
      .Send<{
        background_profile_img_status: string,
        candidate_id: string,
        cv_document_status: string,
        profile_img_status: string
      }>("/api/v1/candidates/", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token
        }
      })
    if (fail_candidate !== undefined) {
      setLoading(false)
      return setAlert({ show: true, message: fail_candidate.message })
    }

    const [data_address, fail_address] = await RequestAPI.JSONRequest([
      {
        ...formValue.address,
        type: "home"
      },
    ]).Send<string>("/api/v1/candidates/addresses/", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token
      }
    })

    if (fail_address !== undefined) {
      setLoading(false)
      return setAlert({ show: true, message: fail_address.message })
    }

    setLoading(false)
    setAlert({ show: true, message: `${data_candidate?.cv_document_status} and ${data_address}` })
    return setCurrentStep(prev => prev && prev + 1)
  }
  return (
    <Box component={"div"}
      sx={{
        marginBottom: '2em'
      }}
    >
      <form onSubmit={onSubmit}>
        <CandidateForm formValue={formValue.candidate} setFormValue={setFormValue} errMsg={errMsg} />
        <AddressForm formValue={formValue.address} setFormValue={setFormValue} errMsg={errMsg} />
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
    </Box >
  )
}