import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"

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

function makeIcon(name: string) {
    const Icon = iconmap[name]
    return <Icon />
}

function BasicSideMenuItem(props: any) {
    const { spec, sectionKey, isAuthorized, onItemSelect } = props

    return (
        <List key={sectionKey}>
            {
                Object.entries(spec.section.item).map(([itemKey, item]: [any, any]) => {
                    return (
                        // TODO: load user from redux store
                        isAuthorized('admin', item.access) && (
                            <ListItem
                                key={itemKey}
                                disablePadding
                                onClick={() => onItemSelect(itemKey, item)}
                            >
                                <ListItemButton selected={spec.viewPath == itemKey}>
                                    <ListItemIcon>
                                        {makeIcon(item.icon)}
                                    </ListItemIcon>
                                    <ListItemText primary={item.label} />
                                </ListItemButton>
                            </ListItem>
                        )
                    )
                })
            }
            <Divider />
        </List>
    )
}

export default BasicSideMenuItem
