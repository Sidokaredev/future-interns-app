import { Box, SxProps } from "@mui/material"
import React, { useEffect } from "react"

/**
 * 
 * @description parent element for this alert should have to be set position as relative.
 */
export default function BaseAlert({
  show,
  message,
  timeout = 3000,
  setShow,
  sxProps = {
    // borderWidth: '1px',
    // borderStyle: 'solid',
    // borderColor: grey[200],
    marginTop: "1em",
    borderRadius: "0.3em",
    left: '48%',
    padding: '1.25em 1em',
    backgroundColor: '#51a799',
    color: 'white',
    fontFamily: 'Roboto, sans-serif',
    fontSize: 'small',
    letterSpacing: '0.05em'
  }
}: {
  show: boolean
  message: string
  timeout?: number
  setShow: React.Dispatch<React.SetStateAction<{ show: boolean, message: string }>>
  sxProps?: SxProps
}) {
  useEffect(() => {
    if (show) {
      setTimeout(() => {
        setShow({ show: false, message: "" })
      }, timeout)
    }
  }, [show])

  return (
    <Box component={"div"}
      sx={{
        ...sxProps,
        position: 'fixed',
        zIndex: 999,
        opacity: show ? 1 : 0,
        visibility: show ? 'visible' : 'hidden',
        transition: 'transform 0.5s ease, opacity 0.5s ease, visibility 0.5s ease',
        transform: show ? 'translate(-50%, -50%)' : 'translate(-50%, -120%)',
      }}>
      {message}
    </Box>
  )
}