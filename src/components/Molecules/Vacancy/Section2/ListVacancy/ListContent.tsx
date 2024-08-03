import { Box, Chip, Typography } from "@mui/material";

export default function VacancyListContent() {
  return (
    <>
      <Box
        component={'div'}
      >
        <Box
          component={'div'}
          className="vacancy-description"
          // border={'1px solid black'}
          marginY={'0.5em'}
        >
          <Typography
            variant="body2"
            color={'#555555'}
          >
            A Cloud Engineer is responsible for designing, implementing, and managing cloud-based systems and infrastructure to ensure scalability, security, and performance. They collaborate with development teams to optimize cloud solutions and troubleshoot issues within cloud environments.
          </Typography>
        </Box>
        <Box
          component={'div'}
          className="vacancy-category vacancy-tags"
          // border={'1px solid black'}
          marginTop={'1.5em'}
        >
          <Chip
            variant="filled"
            label={"Retail and E-Commerce"}
            // size="small"
            sx={{
              backgroundColor: '#cde6e2',
              fontSize: 'smaller',
              fontWeight: 'bold'
            }}
          />
        </Box>
      </Box>
    </>
  )
}