import { useEffect, useState } from "react";
/* Material UI */
import { Box, Container, useScrollTrigger } from "@mui/material";
/* Molecules */
import NavigationItems from "../Molecules/Navigation/NavigationItems";
import NavigationProfile from "../Molecules/Navigation/NavigationProfile";
import NavigationLogo from "../Molecules/Navigation/NavigationLogo";

export default function NavigationHeader() {
  /* States */
  const [sx, setSx] = useState<any>({ color: '#cacaca' })
  const trigger = useScrollTrigger({ disableHysteresis: true })
  useEffect(() => {
    if(trigger) {
      setSx({
        navigation: {
          bgcolor: '#ffffff',
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px'
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
        }
      })
    }
  }, [trigger])
  return (
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
        }}
      >
        <NavigationLogo sxProps={sx.font} />
        <NavigationItems sxProps={sx.font} />
        <NavigationProfile sxProps={sx} />
      </Container>
    </Box>
  )
}