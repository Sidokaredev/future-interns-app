import { CakeRounded, DialpadRounded, EditRounded, FileDownloadRounded, HomeWorkRounded, LanguageRounded, LaunchRounded, LocationCityRounded, MailOutlineRounded } from "@mui/icons-material";
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { FormEvent, useEffect, useState } from "react";
import { AddressDataType, AddressFormSchema, AddressFormType, CandidateProfileDataType, UserDataType } from "../../../../pages/candidates/types";
import dayjs from "dayjs";
import { GetSession } from "../../../../pages/global-helpers";
import RequestAPI from "../../../../services/api/request";
import AddressForm from "./AddressForm";
import { DEFAULT_ADDRESS_FORM } from "../../../../pages/candidates/constants";

type CandidateProfileUserDataType = CandidateProfileDataType & {
  user: UserDataType
}

export default function AddressData({
  openDialog,
  handleOpenDialog,
  onCloseDialog,
  setAlert,
}: {
  openDialog: Record<string, boolean>;
  handleOpenDialog: (key: string) => void;
  onCloseDialog: (key: string) => void;
  setAlert: React.Dispatch<React.SetStateAction<{ show: boolean, message: string }>>;
}) {
  /* state */
  const [addressData, setAddressData] = useState<AddressDataType | null>(null)
  const [profileData, setProfileData] = useState<CandidateProfileUserDataType | null>(null)
  const [formValue, setFormValue] = useState<AddressFormType>(DEFAULT_ADDRESS_FORM)
  const [errMsg, setErrMsg] = useState<{ [key: string]: string[] }>({})
  const [refetch, setRefetch] = useState<boolean>(false)
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  /* constant */
  const personalDetailProps = [
    {
      icon: (
        <MailOutlineRounded
          fontSize="small"
          sx={{ marginRight: "0.5em", color: grey[400] }}
        />
      ),
      label: "Email",
      value: profileData?.user?.email,
    },
    {
      icon: (
        <CakeRounded
          fontSize="small"
          sx={{ marginRight: "0.5em", color: grey[400] }}
        />
      ),
      label: "Date of Birth",
      value: dayjs(profileData?.date_of_birth).format("MMMM, DD dddd YYYY"),
    },
    {
      icon: (
        <HomeWorkRounded
          fontSize="small"
          sx={{ marginRight: "0.5em", color: grey[400] }}
        />
      ),
      label: "Address",
      value: `${addressData?.street}, ${addressData?.neighborhood}, ${addressData?.rural_area}, ${addressData?.sub_district}`,
    },
    {
      icon: (
        <LocationCityRounded
          fontSize="small"
          sx={{ marginRight: "0.5em", color: grey[400] }}
        />
      ),
      label: "City",
      value: addressData?.city,
    },
    {
      icon: (
        <LanguageRounded
          fontSize="small"
          sx={{ marginRight: "0.5em", color: grey[400] }}
        />
      ),
      label: "Country",
      value: addressData?.country,
    },
    {
      icon: (
        <DialpadRounded
          fontSize="small"
          sx={{ marginRight: "0.5em", color: grey[400] }}
        />
      ),
      label: "Postal Code",
      value: addressData?.postal_code,
    },
  ];
  /* onSubmit */
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(prev => ({
      ...prev,
      ["submit"]: true
    }))

    const validate = AddressFormSchema.safeParse(formValue)
    if (!validate.success) {
      let errorSchema = validate.error.flatten().fieldErrors
      setLoading(prev => ({
        ...prev,
        ["submit"]: false
      }))
      return setErrMsg(errorSchema)
    }
    setErrMsg({})

    const token = GetSession("auth")
    const [success, fail] = await RequestAPI.JSONRequest(formValue)
      .Send<string>("/api/v1/candidates/addresses/", {
        method: "PATCH",
        headers: {
          "Authorization": "Bearer " + token
        }
      })
    if (fail) {
      setLoading(prev => ({
        ...prev,
        ["submit"]: false
      }))
      return setAlert({ show: true, message: fail.message })
    }
    if (success) {
      setRefetch(prev => !prev)
      setLoading(prev => ({
        ...prev,
        ["submit"]: false
      }))
      onCloseDialog("address")
      return setAlert({ show: true, message: success })
    }
  }
  /* fetching */
  useEffect(() => {
    const token = GetSession("auth");
    (async () => {
      const [data, fail] = await RequestAPI.Send<AddressDataType>("/api/v1/candidates/addresses/", {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token
        }
      })

      // it should have a persistent snackbar within the retry fetch button
      if (fail) {
        return setAlert({ show: true, message: fail.message })
      }

      if (data) {
        return setAddressData(data)
      }
    })()
  }, [refetch])
  useEffect(() => {
    const token = GetSession("auth");
    (async () => {
      const [data, fail] = await RequestAPI.Send<CandidateProfileUserDataType>("/api/v1/candidates/?includes=user", {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token
        }
      })

      if (fail) {
        return setAlert({ show: true, message: fail.message })
      }

      if (data) {
        return setProfileData(data)
      }
    })()
  }, [])
  return (
    <Stack
      direction={"column"}
      spacing={1}
      sx={{
        border: "1px solid " + grey[300],
        padding: "0.5em",
        borderRadius: "0.3em",
        backgroundColor: grey[100]
      }}
    >
      <Box component={"div"}
        sx={{
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 550,
            color: grey[800],
            marginBottom: "0.5em",
          }}
        >
          Personal Detail
        </Typography>
        <IconButton size="small"
          onClick={() => {
            setFormValue(addressData as AddressDataType)
            handleOpenDialog("address")
          }}
        >
          <EditRounded fontSize="small" />
        </IconButton>
      </Box>
      {personalDetailProps.map((data, index) => (
        <Box
          key={index}
          component={"div"}
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Box
            component={"div"}
            className="label"
            sx={{
              minWidth: "8em",
              display: "flex",
            }}
          >
            {data.icon}
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 550,
                color: grey[500],
              }}
            >
              {data.label}
            </Typography>
          </Box>
          <Typography
            variant="subtitle2"
            textAlign={"end"}
            sx={{
              color: grey[800],
            }}
          >
            {data.value}
          </Typography>
        </Box>
      ))}
      <Divider
        orientation="horizontal"
        sx={{ borderColor: grey[300], paddingY: "0.5em" }}
      />
      <Box
        component={"div"}
        sx={{
          borderRadius: "0.5em",
        }}
      >
        <Button
          component={"a"}
          target="_blank"
          href={`http://localhost:3000${profileData?.cv_document_path}`}
          variant="text"
          endIcon={<LaunchRounded />}
          fullWidth
        >
          View
        </Button>
        <Box
          sx={{
            display: "flex",
          }}
        >
          <Button
            component={"a"}
            href={`http://localhost:3000${profileData?.cv_document_path}/download`}
            variant="contained"
            endIcon={<FileDownloadRounded />}
            color="primary"
            size="small"
            fullWidth
          >
            Download CV
          </Button>
        </Box>
      </Box>
      <Dialog
        open={Boolean(openDialog["address"])}
        onClose={() => {
          onCloseDialog("address")
        }}
        maxWidth={"md"}
        PaperProps={{
          sx: {
            padding: "1em"
          }
        }}
        fullWidth
      >
        <AddressForm
          formValue={formValue}
          setFormValue={setFormValue}
          errMsg={errMsg}
          onSubmit={onSubmit}
          loading={loading}
        // setLoading={setLoading}
        />
      </Dialog>
    </Stack>
  )
}