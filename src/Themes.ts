import { createTheme } from "@mui/material";
import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    xs: true;
    xsMobile: true;
    smMobile: true;
    sm: true;
    smTablet: true;
    smDesk: true;
    md: true;
    lg: true;
    lgTablet: true;
    lgDesk: true;
    xl: true;
  }
}

/* Default Overrides Style */
const FutureInternsTheme = createTheme({
  palette: {
    primary: {
      main: "#06816d",
      contrastText: "#c2fffb",
    },
    secondary: {
      main: "#9e9e9e",
      contrastText: "#757575",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          // '&:hover': {
          //   color: '#c2fffb'
          // },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        noWrap: {
          whiteSpace: "initial",
          // overflow: "hidden",
          // textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: "3",
          WebkitBoxOrient: "vertical",
        },
      },
    },
    MuiUseMediaQuery: {
      defaultProps: {
        noSsr: true,
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: "#cde6e2",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {},
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: "0",
        },
      },
    },
  },
  breakpoints: {
    values: {
      ...createTheme().breakpoints.values,
      lgTablet: 769,
    },
  },
});

export default FutureInternsTheme;
