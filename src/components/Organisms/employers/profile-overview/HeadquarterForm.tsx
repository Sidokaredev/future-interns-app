import { Autocomplete, Box, Button, CircularProgress, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { Countries, Provinces } from "../../../../pages/candidates/constants";
import { grey, red } from "@mui/material/colors";
import { HeadquarterFormType } from "../../../../pages/employers/types";
import React, { FormEvent, useState } from "react";
import { AutoCompleteOnChange, AutoCompleteOnClose, AutoCompleteOnOpen, InputNumberOnChange, InputOnChangeV2, SelectOnChange } from "../../../../pages/global-helpers";

export default function HeadquarterForm({
  formValue,
  setFormValue,
  errMsg,
  onSubmit,
  loading,
}: {
  formValue: HeadquarterFormType;
  setFormValue: React.Dispatch<React.SetStateAction<HeadquarterFormType>>;
  errMsg: { [key: string]: string[] };
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  loading: boolean;
}) {
  /* state */
  const [open, setOpen] = useState<Record<string, boolean>>({});
  return (
    <form onSubmit={onSubmit}>
      <Box component={"div"}>
        <Typography component={"p"} variant="subtitle1"
          sx={{
            marginBottom: "1em",
            fontWeight: 550,
            color: grey[800]
          }}
        >
          Data Kantor Perusahaan
        </Typography>
      </Box>
      <Grid container
        columnSpacing={{ xs: 0, md: 2 }}
        rowSpacing={{ xs: 2, sm: 0 }}
        sx={{ marginBottom: "1em" }}
      >
        <Grid item xs={4}
          sx={{
            marginBottom: "1em",
          }}
        >
          <TextField
            type="text"
            name="name"
            label="Nama Kantor*"
            placeholder="Masukkan nama kantor"
            size="small"
            fullWidth
            autoComplete="off"
            value={formValue.name}
            onChange={InputOnChangeV2(setFormValue)}
            error={errMsg["name"] ? true : false}
            helperText={errMsg["name"] ?? ""}
          />
        </Grid>
        <Grid item xs={12} md={4}
          sx={{
            marginBottom: "1em"
          }}
        >
          <TextField
            type="text"
            name="street"
            label="Alamat Jalan*"
            placeholder="e.g Jl. Sudirman No. 45"
            size="small"
            multiline
            fullWidth
            value={formValue.street}
            onChange={InputOnChangeV2(setFormValue)}
            error={Boolean(errMsg["street"]) ? true : false}
            helperText={errMsg["street"] ?? ""}
          />
        </Grid>
        <Grid item xs={12} md={4}
          sx={{
            marginBottom: "1em"
          }}
        >
          <TextField
            type="text"
            name="neighborhood"
            label="Lingkungan / RT-RW"
            placeholder="e.g RT 01/RW 05"
            size="small"
            fullWidth
            autoComplete="off"
            value={formValue.neighborhood}
            onChange={InputOnChangeV2(setFormValue)}
            error={Boolean(errMsg["neighborhood"]) ? true : false}
            helperText={errMsg["neighborhood"] ?? ""}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            marginBottom: { xs: "1em", md: "1em" },
          }}
        >
          <TextField
            type="text"
            name="rural_area"
            label="Kelurahan / Desa"
            placeholder="e.g Maphar, Glodok etc"
            size="small"
            fullWidth
            autoComplete="off"
            value={formValue.rural_area}
            onChange={InputOnChangeV2(setFormValue)}
            error={Boolean(errMsg["rural_area"]) ? true : false}
            helperText={errMsg["rural_area"] ?? ""}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            marginBottom: { xs: "1em", md: "1em" },
          }}
        >
          <TextField
            type="text"
            name="sub_district"
            label="Kecamatan*"
            placeholder="e.g Kec. Grogol Petamburan"
            size="small"
            fullWidth
            autoComplete="off"
            value={formValue.sub_district}
            onChange={InputOnChangeV2(setFormValue)}
            error={Boolean(errMsg["sub_district"]) ? true : false}
            helperText={errMsg["sub_district"] ?? ""}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            marginBottom: { xs: "1em", md: 0 },
          }}
        >
          <TextField
            type="text"
            name="city"
            label="Kota / Kabupaten*"
            placeholder="e.g Kota Surabaya"
            size="small"
            fullWidth
            autoComplete="off"
            value={formValue.city}
            onChange={InputOnChangeV2(setFormValue)}
            error={Boolean(errMsg["city"]) ? true : false}
            helperText={errMsg["city"] ?? ""}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            marginBottom: { xs: "1em", md: 0 },
          }}
        >
          <Autocomplete
            open={open["province"]}
            options={Provinces}
            // loading={loading["province"]}
            onOpen={AutoCompleteOnOpen("province", setOpen)}
            onClose={AutoCompleteOnClose("province", setOpen)}
            size="small"
            renderInput={(params) => <TextField {...params} label="Provinsi*" error={Boolean(errMsg["province"]) ? true : false}
              helperText={errMsg["province"] ?? ""} />}
            slotProps={{
              paper: {
                sx: {
                  marginBottom: "0.8em",
                },
              },
            }}
            disableClearable
            fullWidth
            value={Boolean(formValue.province) ? formValue.province : undefined}
            onChange={AutoCompleteOnChange("province", setFormValue)}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            marginBottom: { xs: "1em", md: 0 },
          }}
        >
          <Autocomplete
            open={open["country"]}
            options={Countries}
            // loading={loading["country"]}
            onOpen={AutoCompleteOnOpen("country", setOpen)}
            onClose={AutoCompleteOnClose("country", setOpen)}
            size="small"
            getOptionLabel={(option) => option.name}
            // isOptionEqualToValue={(option, value) => option.name === value.name}
            renderOption={(props, option) => {
              const { key, ...restProps } = props
              return (
                <Box
                  key={key}
                  component={"li"}
                  {...restProps}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    columnGap: 2,
                  }}
                >
                  <Box
                    component={"img"}
                    src={option.image_url}
                    width={25}
                    height={15}
                  />
                  <Typography variant="subtitle2">{option.name}</Typography>
                </Box>
              );
            }}
            renderInput={(params) => <TextField {...params} label="Negara*" error={Boolean(errMsg["country"]) ? true : false}
              helperText={errMsg["country"] ?? ""} />}
            disableClearable
            fullWidth
            value={Boolean(formValue.country) ? { name: formValue.country, image_url: "" } : undefined}
            onChange={AutoCompleteOnChange("country", setFormValue, undefined, "name")}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={2}
          sx={{
            marginBottom: { xs: "1em", md: 0 },
          }}
        >
          <TextField
            type="text"
            name="postal_code"
            label="Kode Pos*"
            placeholder="5 Digit angka"
            size="small"
            fullWidth
            autoComplete="off"
            value={String(formValue.postal_code)}
            onChange={InputNumberOnChange(setFormValue)}
            error={Boolean(errMsg["postal_code"]) ? true : false}
            helperText={errMsg["postal_code"] ?? ""}
          />
        </Grid>
        <Grid item xs={2}
          sx={{
            marginBottom: "1em",
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="type_label"
              size="small"
              sx={{
                color: errMsg["type"] ? red[500] : undefined,
                "&.Mui-focused": {
                  color: errMsg["type"] ? red[500] : undefined,
                }
              }}
            >
              Jenis Kantor*
            </InputLabel>
            <Select
              labelId="type_label"
              name="type"
              label="Jenis Kantor*"
              size="small"
              value={formValue.type}
              onChange={SelectOnChange(setFormValue, undefined, { coerceToNumber: false })}
              error={errMsg["type"] && Boolean(errMsg["type"]) ? true : false}
            >
              <MenuItem
                value={"Branch Office"}
              >
                <Typography variant="subtitle2">
                  Kantor Cabang
                </Typography>
              </MenuItem>
              <MenuItem
                value={"Head Office"}
              >
                <Typography variant="subtitle2">
                  Kantor Pusat
                </Typography>
              </MenuItem>
            </Select>
            {errMsg["type"] && (
              <FormHelperText sx={{ color: red[500] }}>{errMsg["type"]}</FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>
      <Box
        component={"div"}
        sx={{
          display: "flex",
          justifyContent: "end"
        }}
      >
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{
            minWidth: "10em"
          }}
        >
          {loading ? (<CircularProgress color="secondary" size={20} />) : "Submit"}
        </Button>
      </Box>
    </form>
  )
}