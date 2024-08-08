import { Container, Link, Stack } from "@mui/material"
import { Link as RouterLink } from "react-router-dom"

export default function AuthFooter() {
  return (
    <>
      <Container
        maxWidth={'lg'}
      >
        <Stack
          direction={'row'}
        >
          <Link
            component={RouterLink}
            to={'github.com'}
          >
            Help
          </Link>
        </Stack>
      </Container>
    </>
  )
}