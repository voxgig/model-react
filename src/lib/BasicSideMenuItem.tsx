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
  FactoryOutlined,
  KeyOutlined,
  AssignmentTurnedInOutlined,
  TextSnippetOutlined,
  HighlightAlt,
  SupervisorAccount as AccountIcon,
  Map as MapIcon,
  Tablet as TabletIcon,
  Update as UpdateIcon,
  Security as AdminIcon,
  ContentPaste as ClipBoardIcon,
  FitScreen,
  Event as EventIcon,
  Logout as LogoutIcon
} from '@mui/icons-material'
import { Gubu } from 'gubu'
import { useSelector } from 'react-redux'

const iconmap: any = {
  factory: FactoryOutlined,
  key: KeyOutlined,
  done: AssignmentTurnedInOutlined,
  docs: TextSnippetOutlined,
  hightlight: HighlightAlt,
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
          )
        )
      })}
      {section.divider && <Divider />}
    </List>
  )
}

export default BasicSideMenuItem
