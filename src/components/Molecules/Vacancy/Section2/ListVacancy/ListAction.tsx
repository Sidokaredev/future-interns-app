import { Box, Button, Chip } from "@mui/material"
import { LocationOnOutlined } from "@mui/icons-material"

export default function VacancyListAction() {
  return (
    <>
      <Box
        component={'div'}
        padding={'0.5em 1em'}
        display={'flex'}
        justifyContent={'space-between'}
        // border={'1px solid black'}
        bgcolor={'#e6f2f0'}
      >
        <Box>
          <Chip icon={<LocationOnOutlined />} label={"Bandengan, Jakarta Utara"} sx={{ backgroundColor: 'transparent' }} />
        </Box>
        <Box>
          <Button variant="contained" color="primary" size="small">Apply</Button>
        </Box>
      </Box>
    </>
  )
}