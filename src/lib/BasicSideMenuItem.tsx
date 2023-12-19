import React from 'react'
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material'

import {
  ChatBubble as ChatBubbleIcon,
  FactoryOutlined as FactoryOutlinedIcon,
  KeyOutlined as KeyOutlinedIcon,
  AssignmentTurnedInOutlined as AssignmentTurnedInOutlinedIcon,
  UploadFileOutlined as UploadFileOutlinedIcon,
  TextSnippetOutlined as TextSnippetOutlinedIcon,
  HighlightAlt as HighlightAltIcon,
  SupervisorAccount as AccountIcon,
  Map as MapIcon,
  Tablet as TabletIcon,
  Update as UpdateIcon,
  Security as AdminIcon,
  ContentPaste as ClipBoardIcon,
  FitScreen,
  Event as EventIcon,
  Logout as LogoutIcon,
  HomeOutlined as HomeOutlinedIcon,
  WarehouseOutlined as WarehouseOutlinedIcon,
  TuneOutlined as TuneOutlinedIcon,
  FactCheckOutlined as FactCheckOutlinedIcon,
  WidgetsOutlined as WidgetsOutlinedIcon,
  AltRoute as AltRouteIcon
} from '@mui/icons-material'
import { Gubu } from 'gubu'
import { useSelector } from 'react-redux'

const iconmap: any = {
  home: HomeOutlinedIcon,
  warehouse: WarehouseOutlinedIcon,
  tune: TuneOutlinedIcon,
  widget: WidgetsOutlinedIcon,
  factCheck: FactCheckOutlinedIcon,
  uploadFile: UploadFileOutlinedIcon,
  altRoute: AltRouteIcon,
  factory: FactoryOutlinedIcon,
  key: KeyOutlinedIcon,
  done: AssignmentTurnedInOutlinedIcon,
  docs: TextSnippetOutlinedIcon,
  hightlight: HighlightAltIcon,
  map: MapIcon,
  account: AccountIcon,
  tablet: TabletIcon,
  update: UpdateIcon,
  admin: AdminIcon,
  clipboard: ClipBoardIcon,
  fitscreen: FitScreen,
  chatBubble: ChatBubbleIcon,
  event: EventIcon,
  logout: LogoutIcon
}

const { Child } = Gubu

const BasicSideMenuItemSpecShape = Gubu({
  section: {
    title: String,
    divider: Boolean,
    item: Child({
      kind: String,
      label: String,
      icon: String,
      path: String,
      access: Child(Boolean, {})
    })
  }
})

function BasicSideMenuItem (props: any) {
  const { sectionKey, onItemSelect } = props

  const viewPath: any = location.pathname.split('/')[2]

  const basicSideMenuItemSpec = BasicSideMenuItemSpecShape(props.spec)

  // TODO: Refactor to use better default
  const userRole =
    useSelector((state: any) => state.main.auth.user.role) || 'user'

  const section = basicSideMenuItemSpec.section

  return (
    <List key={sectionKey}>
      {Object.entries(section.item).map(([itemKey, item]: [any, any]) => {
        return (
          // TODO: Load user role from redux store
          isAuthorized(userRole, item.access) && (
            <>
              <ListItem
                key={itemKey}
                disablePadding
                onClick={() => onItemSelect(itemKey, item)}
              >
                <ListItemButton selected={viewPath == itemKey}>
                  <ListItemIcon>{makeIcon(item.icon)}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
              <Divider className='BasicSideMenuItem-itemDivider' />
            </>
          )
        )
      })}
      {section.divider && <Divider />}
    </List>
  )
}

export default BasicSideMenuItem

function makeIcon (name: string) {
  const Icon = iconmap[name]
  return <Icon />
}

// TODO: Move isAuthorized to utils
// TODO: Allow custom authorization function
function isAuthorized (userRole: string, authorizedRoles: any): boolean {
  return (
    authorizedRoles.hasOwnProperty(userRole) &&
    authorizedRoles[userRole] === true
  )
}
