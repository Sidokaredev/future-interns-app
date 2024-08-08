import { createTheme } from "@mui/material";

/* Custom Overrides Style */
const FutureInternsTheme = createTheme({
  palette: {
    primary: {
      main: '#06816d',
      contrastText: '#c2fffb'
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          // '&:hover': {
          //   color: '#c2fffb'
          // },
        }
      }
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
        }
      }
    },
    MuiUseMediaQuery: {
      defaultProps: {
        noSsr: true
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: '#cde6e2',
        },
      }
    },
    MuiInputBase: {
      styleOverrides: {
        
      }
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: "0"
        }
      }
    }
  }
})

export default FutureInternsTheme;