import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'

import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles'

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
  drawerwidth?: any
}

const BasicAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop: any) => prop !== 'open'
})<AppBarProps>(({ theme, open, drawerwidth }: any) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: drawerwidth,
    width: `calc(100% - ${drawerwidth})`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}))

export default BasicAppBar
