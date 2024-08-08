import { Box, Drawer, ToggleButton } from "@mui/material";
import SearchByCompany from "../../../Molecules/Vacancy/Section2/FilteringVacancy/Company";
import { FilterList } from "@mui/icons-material";
import { useState } from "react";
import FilteringVacancy from "./FilteringVacancy";

export default function MobileFilteringVacancy() {
  /* Mobile Filtering Drawer State */
  const [filteringDrawerOpen, setFilteringDrawerOpen] = useState<boolean>(false)
  const toggleDrawer = (openStatus: boolean) => () => {
    setFilteringDrawerOpen(openStatus)
  }
  return (
    <>
      <Box
        component={'div'}
        display={'flex'}
        alignItems={'end'}
        gap={'0em 1em'}
        paddingY={'0.5em'}
        paddingX={'0.5em'}
      >
        {/* Search Bar */}
        <Box
          flexGrow={1}
        >
          <SearchByCompany useLabel={false} />
        </Box>
        {/* Trigger Filtering Panel Button */}
        <Box>
          <ToggleButton
            value={'trigger.panel-filtering'}
            onClick={() => {
              setFilteringDrawerOpen(true)
            }}
            size="small"
            sx={{
              borderColor: '#51a799',
              marginBottom: '0.25em'
            }}
          >
            <FilterList color="primary" />
          </ToggleButton>
        </Box>
      </Box>
      {/* Drawer Filtering Panel */}
      <Drawer
        open={filteringDrawerOpen}
        onClose={toggleDrawer(false)}
        anchor="bottom" disableScrollLock
      >
        {/* Filtering Vacancy Component */}
        <FilteringVacancy setFilteringDrawerOpen={setFilteringDrawerOpen} />
      </Drawer>
    </>
  )
}