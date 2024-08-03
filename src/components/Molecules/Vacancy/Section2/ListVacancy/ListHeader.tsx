import { BookmarkBorder } from "@mui/icons-material";
import { Avatar, Box, Divider, IconButton, Typography } from "@mui/material";

export default function VacancyListHeader() {
  return (
    <>
      <Box
        display={'flex'}
        // alignItems={'center'}
      >
        {/* Company Logo */}
        <Box
          // border={'1px solid #000000'}
          borderRadius={'0.3em'}
          padding={'0.5em'}
        >
          <Avatar alt="Company Logo" src="/logos/google-png.png" />
        </Box>
        {/* Company Name and Vacancy Title */}
        <Box
          // border={'1px solid black'}
          flexGrow={1}
          paddingX={'0.5em'}
        >
          <Box>
            <Typography
              component={'span'}
              variant="subtitle1"
              fontWeight={'bold'}
              letterSpacing={'0.02em'}
              color={'#555555'}
            >
              Senior Software Engineer
            </Typography>
            <Typography
              component={'span'}
              variant="caption"
              marginX={'1em'}
              color={'#999999'}
            >
              2 days ago
            </Typography>
          </Box>
          <Box
            display={'flex'}
          >
            <Typography
              variant="subtitle2"
              fontWeight={'bold'}
              color={'#777777'}
            >
              Google
            </Typography>
            <Divider orientation="vertical" variant="middle" flexItem sx={{ marginX: '0.5em' }} />
            <Typography
              variant="subtitle2"
            >
              Monthly Pay : {3000000}
            </Typography>
          </Box>
        </Box>
        <Box
          // border={'1px solid black'}
          padding={'0.3em'}
        >
          <IconButton size="small" sx={{ border: '1px solid #cde6e2' }}>
            <BookmarkBorder fontSize="small" color="primary" />
          </IconButton>
        </Box>
      </Box>
    </>
  )
}