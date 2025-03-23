/**
 * Global Helpers or Event Handlers
 */

import React, { ChangeEvent, SyntheticEvent } from "react";
import Cookies from "js-cookie";
import { Dayjs } from "dayjs";
import { SelectChangeEvent, SnackbarCloseReason, SxProps } from "@mui/material";
import { amber, blue, green, grey, purple, red } from "@mui/material/colors";
/* Event Handler */
export function InputOnChange<FormType>(
  formSetState: React.Dispatch<React.SetStateAction<FormType>>
) {
  return (event: React.ChangeEvent<HTMLInputElement>) => {
    formSetState((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };
}

export function InputOnChangeV2<FormType extends object>(
  formSetState: React.Dispatch<React.SetStateAction<FormType>>,
  nestAttr: string = ""
) {
  const listAttr = nestAttr.split(".")
  return (event: ChangeEvent<HTMLInputElement>) => {
    if (nestAttr) {
      formSetState((previous) => {
        let current: any = previous
        for (let i = 0; i < listAttr.length; i++) {
          const key = listAttr[i];

          if (!(key in current)) {
            throw new Error(`the ${key} does not exist`)
          }

          if (i === (listAttr.length - 1)) {
            current[key] = {
              ...current[key],
              [event.target.name]: event.target.value
            }
          } else {
            current = current[key]
          }
        }
        return {
          ...previous,
          ...current
        }
      })
      return
    }
    formSetState((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  }
}
export function InputOnChangeArray<FormType>(
  // index: number | string,
  setFormState: React.Dispatch<React.SetStateAction<FormType>>,
  // nestAttr: string = "",
) {
  return (_: ChangeEvent<HTMLInputElement>) => {
    setFormState((prev: FormType) => {
      return {
        ...prev
      }
    })
  }
}

export function InputNumberOnChange<FormType>(
  setFormState: React.Dispatch<React.SetStateAction<FormType>>,
  nestAttr: string = ""
) {
  return (event: ChangeEvent<HTMLInputElement>) => {
    let numberValue = event.target.value
    if (numberValue.length > 5) {
      return
    }
    if (isNaN(Number(numberValue))) {
      return
    }

    if (nestAttr) {
      setFormState(prev => {
        const listKey = nestAttr.split(".")
        let current: any = prev
        for (let i = 0; i < listKey.length; i++) {
          const key = listKey[i];

          if (!(key in current)) {
            throw new Error(`the key ${key} does not exist`)
          }

          if (i === (listKey.length - 1)) {
            current[key] = {
              ...current[key],
              [event.target.name]: Number(numberValue)
            }
          } else {
            current = current[key]
          }
        }
        return {
          ...prev,
          ...current,
        }
      })

      return
    }

    setFormState(prev => {
      return {
        ...prev,
        [event.target.name]: Number(numberValue)
      }
    })
  }
}

export function SelectOnChange<FormType>(
  setFormState: React.Dispatch<React.SetStateAction<FormType>>,
  nestAttr: string = "",
  config: {
    coerceToNumber: boolean,
    coerceToBoolean?: boolean,
    // autoSetDate?: boolean
  } = { coerceToNumber: true, coerceToBoolean: false }
) {
  return (event: SelectChangeEvent) => {
    let value = config.coerceToNumber ? Number(event.target.value) : event.target.value
    if (nestAttr) {
      setFormState(prev => {
        const listKey = nestAttr.split(".")
        let current: any = prev
        for (let i = 0; i < listKey.length; i++) {
          const key = listKey[i];

          if (!(key in current)) {
            throw new Error(`the key ${key} does not exist`)
          }

          if (i == (listKey.length - 1)) {
            current[key] = {
              ...current[key],
              [event.target.name]: config.coerceToBoolean ? Boolean(value) : value
            }
          } else {
            current = current[key]
          }

        }
        return {
          ...prev,
          ...current
        }
      })

      return
    }
    setFormState(prev => {
      let boolValue = value === "false" ? false : true
      return {
        ...prev,
        [event.target.name]: config.coerceToBoolean ? boolValue : value
      }
    })
  }
}

export function DatePickerOnChange<FormType>(
  targetKey: string,
  // date: Dayjs,
  setFormState: React.Dispatch<React.SetStateAction<FormType>>,
  nestAttr: string = ""
) {
  return (date: Dayjs | null) => {
    const listAttr = nestAttr.split(".")
    const formattedDate = date?.format()
    if (nestAttr) {
      setFormState(previous => {
        let current: any = previous
        for (let i = 0; i < listAttr.length; i++) {
          const key = listAttr[i];

          if (!(key in current)) {
            throw new Error(`the ${key} does not exist`)
          }

          if (i === (listAttr.length - 1)) {
            current[key] = {
              ...current[key],
              [targetKey]: formattedDate
            }
          } else {
            current = current[key]
          }
        }
        return {
          ...previous,
          ...current
        }
      })
      return
    }

    setFormState(previous => ({
      ...previous,
      [targetKey]: formattedDate
    }))
  }
}

export function FileOnChange<T>(
  // key: string,
  setPreviewState: React.Dispatch<React.SetStateAction<Record<string, { src: string, filename: string }>>>,
  setFormState: React.Dispatch<React.SetStateAction<T>>,
  setErrMessage: React.Dispatch<React.SetStateAction<Record<string, string>>>,
  nestAttr: string = ""
) {
  return (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 1048576) {
        setErrMessage(prev => ({
          ...prev,
          [event.target.name]: `your ${event.target.name} must less than 1MB`
        }))
        return
      }
      setErrMessage({})
      const base64 = URL.createObjectURL(file)
      setPreviewState(prev => ({
        ...prev,
        [event.target.name]: {
          src: base64,
          filename: file.name
        }
      }))
      if (nestAttr) {
        const listKey = nestAttr.split(".")
        setFormState(prev => {
          let current: any = prev
          for (let i = 0; i < listKey.length; i++) {
            const key = listKey[i];

            if (!(key in current)) {
              throw new Error(`the ${event.target.name} attribute does not exist`)
            }
            if (i === (listKey.length - 1)) {
              current[key] = {
                ...current[key],
                [event.target.name]: file
              }
            } else {
              current = current[key]
            }
          }

          return {
            ...prev,
            ...current
          }
        })
        return
      }

      setFormState(prev => ({
        ...prev,
        [event.target.name]: file
      }))
    }
  }
}

export function AutoCompleteOnOpen(key: string, setOpenState: React.Dispatch<React.SetStateAction<Record<string, boolean>>>, optionsFetcher: () => Promise<void> = async () => new Promise(resolve => resolve)): () => void {
  return () => {
    setOpenState(prev => ({ ...prev, [key]: true }));
    (async () => {
      await optionsFetcher()
    })()
  }
}

export function AutoCompleteOnClose<T>(key: string, setOpenState: React.Dispatch<React.SetStateAction<Record<string, boolean>>>, optionsDispatch?: React.Dispatch<React.SetStateAction<T>>): () => void {
  return () => {
    setOpenState(prev => ({
      ...prev,
      [key]: false
    }))
    if (optionsDispatch != undefined) {
      optionsDispatch([] as T)
    }
  }
}

export function AutoCompleteOnChange<FormType, ValueType>(
  fieldName: string,
  setFormState: React.Dispatch<React.SetStateAction<FormType>>,
  nestAttr: string = "",
  keyValue: string = "",
) {
  return (_: SyntheticEvent, value: ValueType) => {
    if (nestAttr) {
      setFormState(prev => {
        const listKey = nestAttr.split(".")
        let current: any = prev
        for (let i = 0; i < listKey.length; i++) {
          const key = listKey[i];

          if (!(key in current)) {
            throw new Error(`the key ${key} does not exist`)
          }

          if (i === (listKey.length - 1)) {
            let changedValue: any = value
            if (keyValue) {
              changedValue = value[keyValue as keyof ValueType]
            }
            current[key] = {
              ...current[key],
              [fieldName]: changedValue
            }
          } else {
            current = current[key]
          }
        }
        return {
          ...prev,
          ...current
        }
      })
      return
    }

    let assignValue: any = value
    if (keyValue) {
      assignValue = value[keyValue as keyof ValueType]
    }
    setFormState(prev => ({
      ...prev,
      [fieldName]: assignValue
    }))
  }
}

export const onCloseSnackbar = (setAlert: React.Dispatch<React.SetStateAction<{ show: boolean, message: string }>>) => (
  _: React.SyntheticEvent | Event,
  reason?: SnackbarCloseReason,
) => {
  if (reason === 'clickaway') {
    return;
  }

  setAlert({ show: false, message: "" })
};

/* Cookie Management Helper */
export function SetSession(type: 'auth' | 'type', value: string): void {
  const sessionEncoded = Cookies.withConverter({
    write: (value) => {
      const encoder = new TextEncoder()
      return encoder.encode(value).toString()
    }
  })
  sessionEncoded.set(type, value, { expires: new Date(Date.now() + 1 * 60 * 60 * 1000) })
}

export function DeleteSession(type: "auth" | "some") {
  Cookies.remove(type)
}

export function GetSession(type: 'auth' | 'some'): string {
  const sessionDecoded = Cookies.withConverter({
    read: (value) => {
      const decoder = new TextDecoder()
      let uint8array = new Uint8Array(value.split(',').map(Number))
      return decoder.decode(uint8array)
    }
  })
  return sessionDecoded.get(type) as string
}

export function SesssionChecker(type: 'auth' | 'some'): boolean {
  return Boolean(GetSession(type))
}

/* STYLER HELPERS */
export const interviewResultColor = (result: string): SxProps => {
  switch (result) {
    case "Hire":
      return {
        color: green[700]
      }
    case "Reject":
      return {
        color: red[700]
      }
    case "Next Interview":
      return {
        color: blue[700]
      }
    case "Pending":
      return {
        color: amber[700]
      }
    default:
      return {
        color: grey[700]
      }
  };
};
export const chipColorDeterminer = (status: string): SxProps => {
  switch (status) {
    case "Scheduled":
      return {
        color: purple[700],
        backgroundColor: purple[50],
      };
    case "Re-scheduled":
      return {
        color: amber[700],
        backgroundColor: amber[50],
      };
    case "Waiting":
      return {
        color: amber[700],
        backgroundColor: amber[50],
      };
    case "Pending Acceptance":
      return {
        color: amber[700],
        backgroundColor: amber[50],
      };
    case "Offer Accepted":
      return {
        color: green[700],
        backgroundColor: green[50],
      };
    case "Offer Declined":
      return {
        color: red[700],
        backgroundColor: red[50],
      };
    case "Accepted":
      return {
        color: green[700],
        backgroundColor: green[50],
      };
    default:
      return {
        color: green[700],
        backgroundColor: green[50],
      };
  }
};
