import { Autocomplete, Box, Button, CircularProgress, Grid, TextField, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { AddressFormType } from "../../../../pages/candidates/types";
import React, { FormEvent, useState } from "react";
import { AutoCompleteOnChange, AutoCompleteOnClose, AutoCompleteOnOpen, InputNumberOnChange, InputOnChangeV2 } from "../../../../pages/global-helpers";
import { Countries, Provinces } from "../../../../pages/candidates/constants";

export default function AddressForm({
  formValue,
  setFormValue,
  errMsg,
  onSubmit,
  loading,
  // setLoading,
}: {
  formValue: AddressFormType;
  setFormValue: React.Dispatch<React.SetStateAction<AddressFormType>>;
  errMsg: { [key: string]: string[] };
  onSubmit: (even: FormEvent<HTMLFormElement>) => Promise<void>;
  loading: Record<string, boolean>;
  // setLoading: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
}) {
  /* state */
  const [open, setOpen] = useState<Record<string, boolean>>({})
  return (
    <Box component={"div"} className="address-form-container">
      <Typography
        variant="subtitle1"
        sx={{
          marginBottom: "0.7em",
          fontWeight: 550,
          color: grey[600],
        }}
      >
        Your Address Data
      </Typography>
      <form onSubmit={onSubmit}>
        <Grid
          container
          columnSpacing={{ xs: 0, md: 2 }}
          rowSpacing={{ xs: 2, md: 0 }}
          sx={{
            marginBottom: "1em",
          }}
        >
          <Grid item xs={12} md={8}>
            <TextField
              type="text"
              name="street"
              label="Street"
              placeholder="Your street address"
              size="small"
              multiline
              fullWidth
              value={formValue.street}
              onChange={InputOnChangeV2(setFormValue)}
              error={Boolean(errMsg["street"])}
              helperText={errMsg["street"] ?? ""}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              type="text"
              name="neighborhood"
              label="Neighborhood"
              placeholder="e.g RT 0x/RW 0x"
              size="small"
              fullWidth
              autoComplete="off"
              value={formValue.neighborhood}
              onChange={InputOnChangeV2(setFormValue)}
              error={Boolean(errMsg["neighborhood"])}
              helperText={errMsg["neighborhood"] ?? ""}
            />
          </Grid>
        </Grid>
        <Grid
          container
          columnSpacing={2}
          sx={{
            marginBottom: { xs: 0, md: "1em" },
          }}
        >
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
              name="rural_area"
              label="Rural Area"
              placeholder="e.g Jerukgamping"
              size="small"
              fullWidth
              autoComplete="off"
              value={formValue.rural_area}
              onChange={InputOnChangeV2(setFormValue)}
              error={Boolean(errMsg["rural_area"])}
              helperText={errMsg["rural_area"] ?? ""}
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
              name="sub_district"
              label="Sub District"
              placeholder="e.g Kec. Krian"
              size="small"
              fullWidth
              autoComplete="off"
              value={formValue.sub_district}
              onChange={InputOnChangeV2(setFormValue)}
              error={Boolean(errMsg["sub_district"])}
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
              label="City"
              placeholder="e.g Kab. Sidoarjo or Kota Surabaya"
              size="small"
              fullWidth
              autoComplete="off"
              value={formValue.city}
              onChange={InputOnChangeV2(setFormValue)}
              error={Boolean(errMsg["city"])}
              helperText={errMsg["city"] ?? ""}
            />
          </Grid>
        </Grid>
        <Grid container columnSpacing={2}>
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
              loading={loading["province"]}
              onOpen={AutoCompleteOnOpen("province", setOpen)}
              onClose={AutoCompleteOnClose("province", setOpen)}
              size="small"
              renderInput={(params) => <TextField {...params} label="Province" error={Boolean(errMsg["province"]) ? true : false}
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
              loading={loading["country"]}
              onOpen={AutoCompleteOnOpen("country", setOpen)}
              onClose={AutoCompleteOnClose("country", setOpen)}
              size="small"
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.name === value.name}
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
              renderInput={(params) => <TextField {...params} label="Country" error={Boolean(errMsg["country"])}
                helperText={errMsg["country"] ?? ""} />}
              disableClearable
              fullWidth
              value={Boolean(formValue.country) ? { name: formValue.country, image_url: "" } : undefined}
              onChange={AutoCompleteOnChange("country", setFormValue)}
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
              name="postal_code"
              label="Postal Code"
              placeholder="Your 5 number of postal code"
              size="small"
              fullWidth
              autoComplete="off"
              value={String(formValue.postal_code)}
              onChange={InputNumberOnChange(setFormValue)}
              error={Boolean(errMsg["postal_code"])}
              helperText={errMsg["postal_code"] ?? ""}
            />
          </Grid>
        </Grid>
        <Box component={"div"}
          sx={{
            display: "flex",
            justifyContent: { md: "end" },
            marginTop: "1em",
          }}
        >
          <Button
            type="submit"
            variant="contained"
            size="small"
            disabled={loading["submit"]}
            sx={{
              minWidth: { xs: "100%", md: "10em" }
            }}
          >
            {loading["submit"] ? (
              <CircularProgress size={20} />
            ) : ("Submit")}
          </Button>
        </Box>
      </form>
    </Box>
  )
}