import { useSelector } from 'react-redux'

import { useNavigate } from 'react-router-dom'

import { Child, Exact, Gubu } from 'gubu'
import BasicSideMenu from './BasicSideMenu'
import { ChevronLeft } from '@mui/icons-material'
import { Divider, IconButton } from '@mui/material'
import { BasicDrawer, BasicDrawerHeader } from './BasicDrawer'

// TODO: Make sure Child() fails properly
const BasicSideSpecShape = Gubu({
  side: {
    logo: {
      img: String
    },
    section: Child({
      title: String,
      item: Child({
        kind: Exact('resource'),
        label: String,
        icon: String,
        path: String,
        access: Child(Boolean, {})
      })
    })
  },
  view: Child({
    title: String,
    icon: String,
    content: {}
  })
})

function onClose (seneca: any) {
  seneca.act('aim:app,set:state', {
    section: 'vxg.cmp.BasicSide.show',
    content: false
  })
}

function BasicSide (props: any) {
  const { vxg, ctx } = props
  const { model, seneca } = ctx()

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

  return (
    <BasicDrawer variant='permanent' drawerwidth='16rem' open={open}>
      <BasicDrawerHeader>
        <img src={basicSideSpec.side.logo.img} style={{ width: '5rem' }} />
        <IconButton onClick={() => onClose(seneca)}>
          <ChevronLeft sx={{ color: 'black' }} />
        </IconButton>
      </BasicDrawerHeader>
      <Divider />
      <BasicSideMenu spec={basicSideMenuSpec} onItemSelect={handleItemSelect} />
    </BasicDrawer>
  )
}

export default BasicSide
