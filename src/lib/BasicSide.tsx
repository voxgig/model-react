import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Exact, Gubu } from 'gubu'
import BasicSideMenu from './BasicSideMenu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  styled,
  useTheme
} from '@mui/material'
import { BasicDrawer, BasicDrawerHeader } from './BasicDrawer'

const { Child } = Gubu

// TODO: Make sure Child() fails properly
const BasicSideSpecShape = Gubu({
  side: {
    logo: {
      img: String
    },
    variant: String,
    section: Child({
      title: String,
      divider: Boolean,
      item: Child({
        kind: String,
        label: String,
        icon: String,
        path: String,
        access: Child(Boolean, {})
      })
    })
  },
  view: {}
})

function onClose (seneca: any) {
  seneca.act('aim:app,set:state', {
    section: 'vxg.cmp.BasicSide.show',
    content: false
  })
}

function BasicSide (props: any) {
  const { vxg, ctx } = props
  const { seneca } = ctx()
  const theme = useTheme()

  const vxgState = useSelector((state: any) => state.main.vxg)
  const open = vxgState.cmp.BasicSide.show

  const navigate = useNavigate()

  const basicSideSpec = BasicSideSpecShape(props.spec)

  function handleItemSelect (key: any, item: any) {
    if (item.kind === 'resource') {
      navigate(item.path)
    }
  }

  const basicSideMenuSpec = {
    section: basicSideSpec.side.section
  }

  const drawerVariant = basicSideSpec.side.variant

  // TODO: refactor and DRY
  if (drawerVariant === 'permanent') {
    // TODO: Extract Box sx={} to theme
    return (
      <Drawer open={open}>
        <Toolbar />
        <Box
          sx={{
            backgroundColor: '#2a2d49',
            overflow: 'auto',
            marginLeft: '30px',
            marginBottom: '20px',
            marginTop: '20px',
            width: '200px',
            height: '100%'
          }}
        >
          <BasicSideMenu
            spec={basicSideMenuSpec}
            onItemSelect={handleItemSelect}
          />
        </Box>
      </Drawer>
    )
  } else {
    return (
      <Drawer open={open}>
        <Box>
          <BasicDrawerHeader>
            <img src={basicSideSpec.side.logo.img} style={{ width: '5rem' }} />
            <IconButton onClick={() => onClose(seneca)}>
              <ChevronLeftIcon sx={{ color: theme.palette.primary.main }} />
            </IconButton>
          </BasicDrawerHeader>
          <Divider />
          <BasicSideMenu
            spec={basicSideMenuSpec}
            onItemSelect={handleItemSelect}
          />
        </Box>
      </Drawer>
    )
  }
}

export default BasicSide

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end'
}))

// <Drawer open={open}>
//   {/* <Toolbar /> */}
//   <Box
//     sx={{
//       backgroundColor: '#2a2d49',
//       overflow: 'auto',
//       marginLeft: '30px',
//       marginBottom: '20px',
//       width: '200px',
//       height: '100%'
//     }}
//   >
//     <BasicDrawerHeader>
//       <img src={basicSideSpec.side.logo.img} style={{ width: '5rem' }} />
//       <IconButton onClick={() => onClose(seneca)}>
//         <ChevronLeftIcon sx={{ color: theme.palette.primary.main }} />
//       </IconButton>
//     </BasicDrawerHeader>
//     <Divider />
//     <BasicSideMenu spec={basicSideMenuSpec} onItemSelect={handleItemSelect} />
//   </Box>
// </Drawer>
