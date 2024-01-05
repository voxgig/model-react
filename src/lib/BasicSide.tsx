import React, { useCallback, Fragment } from 'react'

import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Gubu } from 'gubu'
// import BasicSideMenu from './BasicSideMenu'

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'

import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Toolbar,
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
  const { seneca, model } = ctx()
  let viewMap = model.app.web.frame.private.view
  let { cmap } = seneca.context
  
  const navigate = useNavigate()
  const nav = useSelector((state:any)=>state.main.nav)

  // console.log('BasicSide NAV', nav)
  
  const sections = Object.values(nav.section)
    .filter((n:any)=>n.active)
    .map((n:any)=>({
      name: n.name,
      items: Object.values(n.item)
        .filter((n:any)=>n.active && viewMap[n.view])
        .map((n:any)=>({
          name: n.name,
          view: n.view,
          title: viewMap[n.view].title
        }))
    }))
    
    // console.log('BasicSide SECTIONS', JSON.stringify(sections))
  
  /*
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
          className='DrawerContainer'
          sx={{
            backgroundColor: '#2a2d49',
            overflow: 'auto',
            marginLeft: '23px',
            marginBottom: '20px',
            marginTop: '15px',
            width: '189px',
            height: '100%',
            borderRadius: '4px'
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
   */


  const selectView = useCallback((view:string)=>navigate('/view/'+view),[])
  
  
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={true}
      className="vxg-BasicSide"
    >

      { sections.map((section) =>
        <Fragment key={section.name}>
          <List
            className="vxg-BasicSide-section"
            data-vxg-basicside-section={section.name}
          >
            { section.items.map((item) =>
              <ListItem
                key={item.name}
                disablePadding
                className="vxg-BasicSide-section-item"
                data-vxg-basicside-section-item={item.name}
              >
                <ListItemButton
                  onClick={()=>selectView(item.view)}
                >
                  <ListItemIcon>
                    <ChevronLeftIcon />
                  </ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItemButton>
              </ListItem>
            )}
          </List>
          <Divider />
        </Fragment>
      )} 
    </Drawer>
  )
}

export {
  BasicSide
}
