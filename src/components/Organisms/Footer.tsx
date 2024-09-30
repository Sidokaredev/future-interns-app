import {
  Box,
  Container,
  Divider,
  Stack,
  Typography,
  Link,
  IconButton,
} from "@mui/material";
import { Link as ReactRouterLink } from "react-router-dom";
import { GitHub, Instagram, LinkedIn, MailOutline } from "@mui/icons-material";

export default function Footer() {
  /* styles */
  const footerItemStyles = {
    textDecoration: "none",
    color: "#c2c2c2",
    "&:hover": {
      color: "#85fff7",
    },
  };
  return (
    <Box
      bgcolor={"#003C43"}
      paddingY={"2rem"}
      paddingX={{ xs: "1em", md: "2em" }}
    >
      <Container disableGutters maxWidth="lg">
        <Box
          display={"flex"}
          flexDirection={{ xs: "column", md: "row" }}
          gap={{ xs: "2em", md: "0em" }}
          justifyContent={"space-between"}
        >
          {/* Footer Logo */}
          <Stack
            direction={"row"}
            spacing={2}
            alignItems={"center"}
            justifyContent={{ xs: "start", sm: "center", md: "start" }}
          >
            <img
              src={"/future-interns-app/Future Interns Logo.svg"}
              alt="Future Interns Logo"
              width={30}
              height={30}
              loading="lazy"
            />
            <Link
              component={ReactRouterLink}
              to="/"
              style={{ textDecoration: "none" }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={"bolder"}
                color={"white"}
              >
                Future Interns
              </Typography>
            </Link>
          </Stack>
          {/* Footer Items */}
          <Stack
            direction={{ xs: "column", sm: "row", md: "row" }}
            justifyContent={"center"}
            spacing={{ xs: 1, sm: 2, md: 5 }}
          >
            <Link component={ReactRouterLink} to={"/"} sx={footerItemStyles}>
              <Typography variant="subtitle2">How it works</Typography>
            </Link>
            <Link component={ReactRouterLink} to={"/"} sx={footerItemStyles}>
              <Typography variant="subtitle2">Create Vacancies</Typography>
            </Link>
            <Link component={ReactRouterLink} to={"/"} sx={footerItemStyles}>
              <Typography variant="subtitle2">About Us</Typography>
            </Link>
            <Link component={ReactRouterLink} to={"/"} sx={footerItemStyles}>
              <Typography variant="subtitle2">Contact Us</Typography>
            </Link>
          </Stack>
        </Box>
        <Divider sx={{ bgcolor: "#e1fefc51", marginY: "1.5rem" }} />
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column-reverse", sm: "row" },
            gap: "1em 0em",
            justifyContent: "space-between",
            color: "#c1c1c1",
          }}
        >
          {/* Copyright Text */}
          <Stack>
            <Typography variant="subtitle2">
              &copy; 2024 Future Interns. All rights reserved
            </Typography>
            <Typography variant="caption">
              Website designed and developed by
              <Link
                href="https://github.com/Sidokaredev"
                sx={{ textDecoration: "none", fontWeight: "bold" }}
              >
                {" "}
                Sidokaredev
              </Link>
            </Typography>
          </Stack>
          {/* Social Media Link */}
          <Stack direction={"row"} spacing={1}>
            {/* GitHub */}
            <IconButton
              component={ReactRouterLink}
              to="https://github.com/Sidokaredev"
              target="_blank"
            >
              <GitHub fontSize="small" sx={{ color: "black" }} />
            </IconButton>
            {/* LinkedIn */}
            <IconButton
              component={ReactRouterLink}
              to="https://github.com"
              target="_blank"
            >
              <LinkedIn fontSize="small" sx={{ color: "#0e76a8" }} />
            </IconButton>
            {/* Instagram */}
            <IconButton
              component={ReactRouterLink}
              to="https://github.com"
              target="_blank"
            >
              <Instagram fontSize="small" sx={{ color: "#E4405F" }} />
            </IconButton>
            {/* Email */}
            <IconButton
              component={ReactRouterLink}
              to="https://github.com"
              target="_blank"
            >
              <MailOutline fontSize="small" sx={{ color: "#bbbbbb" }} />
            </IconButton>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
