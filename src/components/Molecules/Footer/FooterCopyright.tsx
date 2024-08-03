import { Link as RouterLink } from "react-router-dom";
import { GitHub, Instagram, LinkedIn, MailOutline } from "@mui/icons-material";
import { Box, IconButton, Link, Stack, Typography } from "@mui/material";

export default function FooterCopyright() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        color: '#c1c1c1'
      }}>
      {/* Copyright Text */}
      <Stack>
        <Typography variant="subtitle2">
          &copy; 2024 Future Interns. All rights reserved
        </Typography>
        <Typography variant="caption">
          Website designed and developed by
          <Link href="https://github.com/Sidokaredev" sx={{ textDecoration: 'none', fontWeight: 'bold' }}> Sidokaredev</Link>
        </Typography>
      </Stack>
      {/* Social Media Link */}
      <Stack direction={'row'}
        spacing={1}
      >
        {/* GitHub */}
        <IconButton component={RouterLink} to="https://github.com/Sidokaredev" target="_blank">
          <GitHub fontSize="small" sx={{ color: 'black' }} />
        </IconButton>
        {/* LinkedIn */}
        <IconButton component={RouterLink} to="https://github.com" target="_blank">
          <LinkedIn fontSize="small" sx={{ color: '#0e76a8' }} />
        </IconButton>
        {/* Instagram */}
        <IconButton component={RouterLink} to="https://github.com" target="_blank">
          <Instagram fontSize="small" sx={{ color: '#E4405F' }} />
        </IconButton>
        {/* Email */}
        <IconButton component={RouterLink} to="https://github.com" target="_blank">
          <MailOutline fontSize="small" sx={{ color: '#bbbbbb' }} />
        </IconButton>
      </Stack>
    </Box>
  )
}