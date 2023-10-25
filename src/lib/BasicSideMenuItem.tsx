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
import { Child, Gubu } from 'gubu'

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

// TODO: Grab the role from the redux store
const userRole = 'admin'

// TODO: move to utils
// TODO: allow custom authorization function
function isAuthorized (userRole: string, authorizedRoles: any): boolean {
  return (
    authorizedRoles.hasOwnProperty(userRole) &&
    authorizedRoles[userRole] === true
  )
}

// spec schema definition with Gubu
const BasicSideMenuItemSpecShape = Gubu({
  section: Child({
    title: String,
    item: Child({
      kind: String,
      label: String,
      icon: String,
      path: String,
      access: Child(Boolean, {})
    })
  })
})

function BasicSideMenuItem (props: any) {
  const { sectionKey, onItemSelect } = props

  const viewPath: any = location.pathname.split('/')[2]

  const basicSideMenuItemSpec = BasicSideMenuItemSpecShape(props.spec)

  return (
    <List key={sectionKey}>
      {Object.entries(basicSideMenuItemSpec.section.item).map(
        ([itemKey, item]: [any, any]) => {
          return (
            // TODO: load user from redux store
            isAuthorized('admin', item.access) && (
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
        }
      )}
      <Divider />
    </List>
  )
}

export default BasicSideMenuItem
