import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles'

import MuiDrawer from '@mui/material/Drawer'

const BasicDrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1),
  minHeight: '43px',
  // border: '2px solid black',
  // border: '2px solid white',
  // padding: '10px 10px 10px 10px',
  // necessary for content to be below app bar
  ...theme.mixins.toolbar
}))

interface DrawerProps {
  open?: boolean
  drawerwidth?: any
}

const BasicDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })<DrawerProps>(
  ({ theme, open, drawerwidth }) => ({
    width: drawerwidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme, drawerwidth),
      '& .MuiDrawer-paper': openedMixin(theme, drawerwidth)
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme)
    })
  })
)

const openedMixin = (theme: Theme, drawerwidth: any): CSSObject => ({
  // backgroundColor: theme.palette.primary.main,
  width: drawerwidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: 'hidden'
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: 'hidden',
  display: 'none',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`
  }
})

export { BasicDrawer, BasicDrawerHeader }
