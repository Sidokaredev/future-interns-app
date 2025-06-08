import {
  Box,
  Button,
  Container,
  InputBase,
  InputLabel,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Place, WorkOutline } from "@mui/icons-material";
import React, { ChangeEvent, useState } from "react";

export default function HomeSection1({
  setSearchQuery
}: {
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}) {
  /* react-router */
  /* state */
  const [searchJob, setSearchJob] = useState<{ keyword: string, location: string }>({ keyword: "", location: "" });
  /* media query */
  const isMobile = useMediaQuery("(max-width:900px)");
  return (
    <Container disableGutters maxWidth="md">
      <Stack sx={{ textAlign: "center", color: "#ffffff" }}>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          sx={{
            fontWeight: "bolder",
          }}
        >
          Punya Talenta ?
        </Typography>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          sx={{
            fontWeight: "bolder",
          }}
        >
          Raih Kesempatanmu Sekarang
        </Typography>
        <Box
          display={"flex"}
          justifyContent={"center"}
          marginTop={"1rem"}
          padding={{ xs: "0.5em", lg: "none" }}
        >
          <Typography
            variant="subtitle1"
            maxWidth={"36rem"}
            sx={{ color: "#d9d9d9" }}
          >
            Temukan pekerjaan dan peluang karir terbaik. Kami telah membantu berbagai perusahaan menemukan talenta unggulan selama beberapa tahun terakhir.
          </Typography>
        </Box>
      </Stack>
      {/* Search Bar for Homepage */}
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
            let query = `keyword=${searchJob.keyword}&location=${searchJob.location}`;
            setSearchQuery(query);
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
                id="search-by-keywords"
                name="keyword"
                placeholder="Cari berdasarkan kata kunci"
                size="small"
                sx={{
                  paddingX: "0.3em",
                }}
                inputProps={{ style: { paddingLeft: "0.5em" } }}
                fullWidth
                value={searchJob.keyword}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  let value = event.target.value;
                  let name = event.target.name;
                  setSearchJob(prev => ({
                    ...prev,
                    [name]: value
                  }))
                }}
              />
            </Box>
            {/* Search Location */}
            <Box
              display={"flex"}
              flexGrow={1}
              alignItems={"center"}
              marginBottom={{
                xs: "1em",
                sm: "0em",
              }}
            >
              <InputLabel htmlFor="search-by-location">
                <Place fontSize="small" color="primary" />
              </InputLabel>
              <InputBase
                id="search-by-location"
                name="location"
                placeholder="Cari berdasarkan kota atau provinsi"
                size="small"
                sx={{
                  paddingX: "0.3em",
                }}
                inputProps={{ style: { paddingLeft: "0.5em" } }}
                fullWidth
                value={searchJob.location}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  let value = event.target.value;
                  let name = event.target.name;
                  setSearchJob(prev => ({
                    ...prev,
                    [name]: value
                  }))
                }}
              />
              {/* <InputLabel htmlFor="select-location">
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
              /> */}
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
                Cari
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        justifyContent={"center"}
        color={"#d9d9d9"}
      >
        <Typography variant="body1" textAlign={"center"} fontWeight={"bold"}>
          Pencarian Populer:
        </Typography>
        <Typography
          variant="body1"
          textAlign={"center"}
          paddingX={{ xs: 0.3, md: 0 }}
        >
          Designer, Developer, Web, IOS, PHP Senior Engineer
        </Typography>
      </Stack>
    </Container>
  );
}
