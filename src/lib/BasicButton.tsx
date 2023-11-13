import { Button, ButtonProps as MuiButtonProps } from '@mui/material'

import { styled, Theme } from '@mui/material/styles'

interface BProps extends MuiButtonProps {
  theme?: Theme
}

const BasicButton = styled(Button, {
  shouldForwardProp: (prop: any) => prop !== 'theme'
})<BProps>(({ theme }: any) => ({
  // color: theme.palette.primary.main
  // border: '1px solid ' + theme.palette.primary.main
}))

export default BasicButton
