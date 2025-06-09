import { Avatar, Box, CircularProgress, Typography } from "@mui/material";

export default function BaseLoading() {
  return (
    <>
      <Box
        width={'100%'}
        height={'100vh'}
        display={'flex'}
        flexDirection={'column'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Avatar
          alt="Sidokaredev Logo"
          src="/future-interns-app/logos/sidokaredev-basic.png"
          sx={{
            width: '3em',
            height: '3em',
          }}
        />
        <Typography variant="caption" color={'primary'} marginY={'2em'}>Sidokaredev</Typography>
        <CircularProgress color={'primary'} />
      </Box>
    </>
  )
}