import { useSelector } from 'react-redux'

import { useNavigate, useLocation } from 'react-router-dom'

import { Child, Gubu, Open, Required } from 'gubu'
import BasicSideMenu from './BasicSideMenu'
import { ChevronLeft } from '@mui/icons-material'
import { Divider, IconButton } from '@mui/material'
import { BasicDrawer, BasicDrawerHeader } from './BasicDrawer'

// spec schema definition with Gubu
const BasicSideSpecShape = Gubu(Required({
  side: {
    logo: {
      img: String
    },
    section: Child({
      title: String,
      item: Child({
        kind: Number,
        label: Number,
        icon: String,
        path: String,
        access: Child(Boolean)
      })
    })
  },
  view: Child(Required({
    title: String,
    icon: Number,
    content: {}
  }))
}))

function onClose(seneca: any) {
  seneca.act('aim:app,set:state', {
    section: 'vxg.cmp.BasicSide.show',
    content: false
  })
}

function BasicSide(props: any) {
  const {
    vxg,
    ctx,
    spec
  } = props
  const { model, seneca } = ctx()

  const vxgState = useSelector((state: any) => state.main.vxg)
  const open = vxgState.cmp.BasicSide.show

  const navigate = useNavigate()
  const location = useLocation()

  BasicSideSpecShape(spec)

  function handleItemSelect(key: any, item: any) {
    if ('resource' === item.kind) {
      navigate(item.path)
    }

  }

  // TODO: clean up props shape
  const basicSideMenuSpec = {
    sectionList: spec.side.section
  }

  return (
    <BasicDrawer
      variant='permanent'
      drawerwidth='16rem'
      open={open}
    >
      <BasicDrawerHeader>
        <img
          src={spec.side.logo.img}
          style={{ width: '5rem' }}
        />
        <IconButton onClick={() => onClose(seneca)}>
          <ChevronLeft sx={{ color: 'black' }} />
        </IconButton>
      </BasicDrawerHeader>
      <Divider />
      <BasicSideMenu spec={basicSideMenuSpec} onClose={onClose} onItemSelect={handleItemSelect} />
    </BasicDrawer>
  )

}

export default BasicSide