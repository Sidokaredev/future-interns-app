import { useEffect, useState } from "react";
/* Material UI */
import { Box, Container, useMediaQuery, useScrollTrigger } from "@mui/material";
/* Molecules */
import NavigationItems from "../Molecules/Navigation/NavigationItems";
import NavigationProfile from "../Molecules/Navigation/NavigationProfile";
import NavigationLogo from "../Molecules/Navigation/NavigationLogo";
import MobileNavigationItems from "../Molecules/Navigation/MobileNavigationItems";

export default function NavigationHeader() {
  /* States */
  const [sx, setSx] = useState<any>({ color: '#cacaca' })
  const trigger = useScrollTrigger({ disableHysteresis: true })
  /* Scroll Effect */
  useEffect(() => {
    if(trigger) {
      setSx({
        navigation: {
          bgcolor: '#ffffff',
          // boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px'
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px'
        },
        font: {
          color: '#06816d',
          '&:hover': {
            color: '#045a55'
          }
        },
        avatar: {
          backgroundColor: '#06816d',
          color: '#ffffff',
        },
        mobileMenu: {
          backgroundColor: '#06816d',
          color: 'white',
          '&:hover': {
            backgroundColor: '#056a59'
          }
        }
      })
    } else {
      setSx({
        navigation: {
          bgcolor: 'transparent',
        },
        font: {
          color: '#ffffff',
          '&:hover': {
            color: '#c2fffb'
          }
        },
        avatar: {
          backgroundColor: '#ffffff',
          color: '#06816d'
        },
        button: {
          backgroundColor: '#c2fffb',
          color: '#045a55',
          '&:hover': {
            backgroundColor: '#85fff7',
          }
        },
        mobileMenu: {
          backgroundColor: 'white',
          color: '#06816d',
          '&:hover': {
            backgroundColor: '#e1e1e1'
          }
        }
      })
    }
  }, [trigger])
  /* Responsive Breakpoints */
  const isMobile = useMediaQuery('(max-width:900px)')
  return (
    <>
      {isMobile ? (
        <Box
          width={'100%'}
          sx={{
            position: 'fixed',
            zIndex: 999,
            paddingY: '0.8rem',
            transition: 'background-color 0.5s ease-in-out',
            ...sx.navigation,
          }}
        >
          <Container
            disableGutters
            maxWidth="md"
            sx={{
              paddingX: '0.5em'
            }}
          >
            <MobileNavigationItems sxProps={sx} />
          </Container>
        </Box>
      ) : (
        <Box
          width={'100%'}
          sx={{
            position: 'fixed',
            zIndex: 999,
            paddingY: '0.8rem',
            transition: 'background-color 0.5s ease-in-out',
            ...sx.navigation,
          }}
        >
          <Container
            disableGutters
            maxWidth="lg"
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingX: {
                xs: '1.5em'
              }
            }}
          >
            <NavigationLogo sxProps={sx.font} />
            <NavigationItems sxProps={sx.font} />
            <NavigationProfile sxProps={sx} />
          </Container>
        </Box>
      )}
    </>
  )
}