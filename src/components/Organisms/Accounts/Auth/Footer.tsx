import { Button, Container, Stack } from "@mui/material"
import { Link as RouterLink } from "react-router-dom"
import { HelpCenterOutlined } from "@mui/icons-material"

export default function AuthFooter() {
  return (
    <>
      <Container
        disableGutters
        maxWidth={'lg'}
        sx={{
          border: '1px solid #e6f2f0',
          borderRadius: '0.3em',
          marginY: '0.5em'
        }}
      >
        <Stack
          direction={'row'}
          justifyContent={'end'}
        >
          <Button
            startIcon={<HelpCenterOutlined />}
            variant="text"
            component={RouterLink}
            to="/support/auth"
            size="small"
          >
            Help
          </Button>
        </Stack>
      </Container>
    </>
  )
}