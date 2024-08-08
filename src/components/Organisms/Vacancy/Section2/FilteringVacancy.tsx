import { Box, Button, Stack } from "@mui/material";
import SearchByCompany from "../../../Molecules/Vacancy/Section2/FilteringVacancy/Company";
import SearchByCategory from "../../../Molecules/Vacancy/Section2/FilteringVacancy/Category";
import SearchByType from "../../../Molecules/Vacancy/Section2/FilteringVacancy/Type";
import SearchByLocation from "../../../Molecules/Vacancy/Section2/FilteringVacancy/Location";
import SearchBySalary from "../../../Molecules/Vacancy/Section2/FilteringVacancy/Salary";

import "../vacancy.css"
import React, { SetStateAction } from "react";

export default function FilteringVacancy({
  setFilteringDrawerOpen
} : {
  setFilteringDrawerOpen?: React.Dispatch<SetStateAction<boolean>>
}) {
  return (
    <>
      <Box
        sx={{
          /* Sticky Maker */
          position: 'sticky',
          top: '5em',
          // overflow: 'scroll',
          // height: '80vh',

          border: '1px solid #e6f2f0',
          borderRadius: '0.4em',
          padding: '1em',
        }}
      >
        <Stack spacing={1}>
          <SearchByCompany />
          <SearchByCategory />
          <SearchByLocation />
          <SearchByType />
          <SearchBySalary />
        </Stack>

        {/* Filtering Button */}
        <Box
          marginTop={'1em'}
        >
          <Button variant="contained" fullWidth>Apply Filter</Button>
          <Button
            variant="text"
            fullWidth
            sx={{
              // marginY: '0.5em'
            }}
          >
              Reset Filter
          </Button>
          {/* Close Button on Mobile */}
          {setFilteringDrawerOpen && (
            <Button
              variant="text"
              fullWidth
              sx={{
                marginY: '0.5em',
                color: 'red'
              }}
              onClick={() => {
                setFilteringDrawerOpen(false)
              }}
            >
              Cancel
            </Button>
          )}
        </Box>
      </Box>
    </>
  )
}