import React, { useCallback, Fragment } from 'react'

import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { styled, useTheme } from '@mui/material/styles'
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'

import { Gubu } from 'gubu'

import { vmap, cmap } from './vxg-seneca'

const CMPNAME = 'BasicSide'
console.log(CMPNAME,'1')


const { Child, Open, Required } = Gubu
const BasicSideSpecShape = Gubu({
  side: {
    name: String,
    active: Boolean,
  },

  view: Child(Open({
    title: String
  }), Required({})),
  
  // Set MUI component props directly 
  mui: {
    Drawer: {},
  }
}, {prefix: CMPNAME})



function BasicSide (props: any) {
  const { spec, ctx } = props
  // const { seneca, model } = ctx()

  const basicSideSpec = BasicSideSpecShape(spec)

  // const theme = useTheme()
  // console.log('THEME', theme)
  const navigate = useNavigate()
  const nav = useSelector((state:any)=>state.main.nav)

  const viewMap = basicSideSpec.view
  const mode = nav.mode
  
  const sections = vmap(nav.section,{
    active: vmap.FILTER,
    name: vmap.COPY,
    items: (_:any,p:any)=>vmap(p.self.item,{
      active: vmap.FILTER,
      name: vmap.COPY,
      view: vmap.COPY,
      title: vmap.FILTER((_:any,p:any)=>viewMap[p.self.view]?.title)
    })
  })

  const selectView = useCallback((view:string)=>navigate('/view/'+view),[])

  
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={'shown' === mode}
      className="vxg-BasicSide"
      sx={(theme:any)=>({
        '& .MuiDrawer-paper': {
          // TODO: should use actual toolbar height; 16 should be from standard spacing
          paddingTop: (theme.mixins.toolbar.minHeight+16)+'px',
          width: 'var(--vxg-side-width)'
        },
      })}
      {...spec.mui.Drawer}
    >

      { sections.map((section:any) =>
        <Fragment key={section.name}>
          <List
            className="vxg-BasicSide-section"
            data-vxg-basicside-section={section.name}
          >
            { section.items.map((item:any) =>
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
