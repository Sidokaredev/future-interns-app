import { Box, Stack, Typography } from "@mui/material";

export default function TextContent() {
  return (
    <Stack
      textAlign={'center'}
      marginTop={'3rem'}
    >
      <Typography
        variant="h5"
        fontWeight={'bold'}
        color={'#045a55'}
      >
        Popular Vacancies
      </Typography>
      <Box
        display={'flex'}
        justifyContent={'center'}
        marginTop={'1rem'}
      >
        <Typography
          variant="subtitle1"
          maxWidth={'35rem'}
          color={'#045a5681'}
        >
          Search all the open positions on the web. Get your own personalized salary estimate. Read reviews on over 30000+ companies worldwide
        </Typography>
      </Box>
    </Stack>
  )
}