import { useState } from "react"
import { Link as RouterLink } from "react-router-dom"
import { Box, Collapse, Drawer, Grid, List, ListItemButton, ListItemIcon, ListItemText, ToggleButton } from "@mui/material"
import { ExpandLess, ExpandMore, Help, Home, Menu as MenuIcon, Work } from "@mui/icons-material"
import NavigationLogo from "./NavigationLogo"
import NavigationOnAuthenticated from "./Authenticated"
import NavigationOnUnauthenticated from "./Unauthenticated"

export default function MobileNavigationItems({ sxProps } : { sxProps?: any }) {
  /* Drawer State */
  const [open, setOpen] = useState<boolean>(false)
  const toggleDrawer = (openStatus: boolean) => () => {
    setOpen(openStatus)
  }
  /* Support Collapse State & Handler */
  const [supportExpand, setSupportExpand] = useState<boolean>(false)
  const supportHandler = () => {
    setSupportExpand(!supportExpand)
  }
  /* HANDLER FETCH DATA */
  const isLoggedIn = true
  return (
    <>
      <Box
        component={'div'}
      >
        <Grid container>
          <Grid item xs={6}
            display={'flex'}
            alignItems={'center'}
          >
            {/* Navigation Logo */}
            <NavigationLogo sxProps={{ fontSize: 'medium', ...sxProps.font }} />
          </Grid>
          <Grid item xs={6}
            sx={{
              display: 'flex',
              justifyContent: 'end'
            }}
          >
            {/* CONDITIONAL RENDERING */}
            {isLoggedIn ? (
              <NavigationOnAuthenticated sxProps={sxProps} />
            ) : (
              <NavigationOnUnauthenticated sxProps={sxProps} />
            )}
            {/* END CONDITIONAL RENDERING */}
            <Box>
              <ToggleButton
                value={open}
                selected={open}
                onClick={() => {
                  setOpen(true)
                }}
                color="primary"
                sx={{
                  ...sxProps.mobileMenu,
                  marginLeft: '1em'
                }}
              >
                <MenuIcon sx={{ ...sxProps.mobileMenu?.color }} />
              </ToggleButton>
            </Box>
          </Grid>
        </Grid>
      </Box>
      {/* DRAWER */}
      <Box>
        <Drawer open={open} onClose={toggleDrawer(false)} anchor="right" disableScrollLock PaperProps={{ sx: { backgroundColor: 'white' } }}>
          <List sx={{ minWidth: '13em', color: '#555555' }}>
            <ListItemButton>
              <ListItemIcon sx={{ marginX: '0.3em' }}>
                <Home sx={{ color: '#06816d' }} />
              </ListItemIcon>
              <ListItemText sx={{ marginX: '0.3em', color: '#06816d' }} primary="Home" />
            </ListItemButton>
            <ListItemButton
              component={RouterLink}
              to={'/vacancy'}
            >
              <ListItemIcon sx={{ marginX: '0.3em' }}>
                <Work sx={{ color: '#83c0b6' }} />
              </ListItemIcon>
              <ListItemText sx={{ marginX: '0.3em' }} primary="Vacancy" />
            </ListItemButton>
            <ListItemButton
              onClick={supportHandler}
            >
              <ListItemIcon sx={{ marginX: '0.3em' }}>
                <Help sx={{ color: '#83c0b6' }} />
              </ListItemIcon>
              <ListItemText sx={{ marginX: '0.3em' }} primary="Support" />
              {supportExpand ? <ExpandLess/> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={supportExpand} timeout={'auto'} unmountOnExit>
                <List disablePadding>
                  <ListItemButton sx={{ paddingLeft: '3.4em' }}>
                    <ListItemText primary="Guides" primaryTypographyProps={{ fontSize: 'small' }} />
                  </ListItemButton>
                  <ListItemButton sx={{ paddingLeft: '3.4em' }}>
                    <ListItemText primary="FAQs" primaryTypographyProps={{ fontSize: 'small' }} />
                  </ListItemButton>
                  <ListItemButton sx={{ paddingLeft: '3.4em' }}>
                    <ListItemText primary="Contact" primaryTypographyProps={{ fontSize: 'small' }} />
                  </ListItemButton>
                </List>
            </Collapse>
          </List>
        </Drawer>
      </Box>
    </>
  )
}