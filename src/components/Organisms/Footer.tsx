import { Box, Container, Divider } from "@mui/material";
import FooterItems from "../Molecules/Footer/FooterItems";
import FooterCopyright from "../Molecules/Footer/FooterCopyright";

export default function Footer() {
  return (
    <Box
      bgcolor={'#003C43'}
      paddingY={'2rem'}
    >
      <Container
        disableGutters
        maxWidth="lg"
      >
        <FooterItems />
        <Divider sx={{ bgcolor: '#e1fefc51', marginY: '1.5rem' }} />
        <FooterCopyright />
      </Container>
    </Box>
  )
}