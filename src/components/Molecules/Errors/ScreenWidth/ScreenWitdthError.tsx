import { Alert, AlertTitle, Box, Typography, useMediaQuery, useTheme } from "@mui/material"
import { ScreenshotMonitor } from "@mui/icons-material"

export default function ScreenWidthError({ addText } : { addText?: string }) {
  const theme = useTheme()
  const onMediumBelow = useMediaQuery(theme.breakpoints.down('md'))
  return (
    <>
      <Box
        component={'div'}
        className="screenwidth-alert-container"
        width={'100%'}
        height={'100vh'}
        sx={{
          bgcolor: '#cde6e2',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingX: onMediumBelow ? '3em' : '0'
        }}
      >
        <Alert icon={<ScreenshotMonitor color="error" />} severity="error">
          <AlertTitle>
            Screen Width Does Not Meet Requirements
          </AlertTitle>
          <Typography fontSize={'small'}>
            {addText ?? ('To access this platform, a screen width of 1200px is required. Please try again using your laptop or personal computer (PC).')}
          </Typography>
          <Typography fontSize={'small'}>
            Responsive mobile display coming soon and developed by <span style={{ fontWeight: 'bold', color: '#06816d' }}>Sidokaredev</span>
          </Typography>
        </Alert>
      </Box>
    </>
  )
}