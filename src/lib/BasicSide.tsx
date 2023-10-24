import { useSelector } from 'react-redux'

import { useNavigate, useLocation } from 'react-router-dom'

import { Child, Gubu, Open } from 'gubu'
import BasicSideMenu from './BasicSideMenu'

function onClose(seneca: any) {
  seneca.act('aim:app,set:state', {
    section: 'vxg.cmp.BasicSide.show',
    content: false
  })
}

const userRole = 'admin'

// TODO: move to utils
// TODO: allow custom authorization function
function isAuthorized(userRole: string, authorizedRoles: any): boolean {
  return authorizedRoles.hasOwnProperty(userRole) && authorizedRoles[userRole] === true
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

  // spec schema definition with Gubu
  const shape = Gubu({})
  shape(spec)

  const viewPath: any = location.pathname.split('/')[2]

  function handleItemSelect(key: any, item: any) {
    navigate(item.path)
  }

  // TODO: clean up object shape
  const menuSpec = {
    logo: spec.side.logo,
    sections: spec.side.section,
    userRole: 'admin',
    viewPath,
    open,
    seneca
  }

  return (
    <BasicSideMenu spec={menuSpec} isAuthorized={isAuthorized} onClose={onClose} onItemSelect={handleItemSelect} />
  )

}

export default BasicSide