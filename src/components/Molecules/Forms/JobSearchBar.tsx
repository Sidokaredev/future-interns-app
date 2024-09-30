import { Place, WorkOutline } from "@mui/icons-material";
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Box,
  Button,
  InputBase,
  InputLabel,
  TextField,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";

export default function JobSearchBar() {
  /* react-router-dom */
  const [searchParams, setSearchParams] = useSearchParams();
  console.info("search params value \t:", searchParams);
  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        paddingY: "1rem",
        paddingX: "1rem",
        marginY: "2rem",
        marginX: {
          xs: "0.5em",
        },
        borderRadius: "0.3rem",
      }}
    >
      <form
        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const keyword = (
            event.currentTarget.elements.namedItem("query") as HTMLInputElement
          ).value;
          setSearchParams({ query: keyword });
        }}
        autoComplete="off"
      >
        <Box
          display={"flex"}
          flexDirection={{
            xs: "column",
            sm: "row",
          }}
        >
          {/* Search Keywords */}
          <Box
            display={"flex"}
            flexGrow={1}
            alignItems={"center"}
            marginBottom={{
              xs: "1em",
              sm: "0em",
            }}
          >
            <InputLabel htmlFor="search-by-keywords">
              <WorkOutline fontSize="small" color="primary" />
            </InputLabel>
            <InputBase
              fullWidth
              id="search-by-keywords"
              placeholder="Search your keywords"
              name="query"
              size="small"
              sx={{
                paddingX: "0.3em",
              }}
              inputProps={{ style: { paddingLeft: "0.5em" } }}
            />
          </Box>
          {/* Search Location */}
          <Box
            display={"flex"}
            flexGrow={2}
            alignItems={"center"}
            marginBottom={{
              xs: "1em",
              sm: "0em",
            }}
          >
            <InputLabel htmlFor="select-location">
              <Place fontSize="small" color="primary" />
            </InputLabel>
            <Autocomplete
              fullWidth
              disablePortal
              disableClearable
              autoSelect
              id="select-location"
              size="small"
              sx={{
                border: "none",
                ".MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
              options={[{ label: "Jawa Timur" }, { label: "Jawa Barat" }]}
              renderInput={(params: AutocompleteRenderInputParams) => (
                <TextField {...params} placeholder="Select location" />
              )}
            />
          </Box>
          {/* Submit button */}
          <Box
            flexGrow={1}
            marginLeft={{
              xs: 0,
              md: 2,
            }}
          >
            <Button type="submit" fullWidth size="large" variant="contained">
              Search
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
}
