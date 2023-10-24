import { Divider, IconButton } from '@mui/material'
import { BasicDrawer, BasicDrawerHeader } from './BasicDrawer'
import {
    ChevronLeft,
} from '@mui/icons-material'
import BasicSideMenuItem from './BasicSideMenuItem'

function BasicSideMenu(props: any) {
    const {
        isAuthorized,
        onClose,
        onItemSelect,
        spec
    } = props

    return (
        <BasicDrawer
            variant='permanent'
            drawerwidth='16rem'
            open={spec.open}
        >
            <BasicDrawerHeader>
                <img
                    src={spec.logo.img}
                    style={{ width: '5rem' }}
                />
                <IconButton onClick={() => onClose(spec.seneca)}>
                    <ChevronLeft sx={{ color: 'black' }} />
                </IconButton>
            </BasicDrawerHeader>
            <Divider />
            {
                Object.entries(spec.sections).map(([sectionKey, section]: [any, any]) => {
                    // TODO: do we need to pass viewPath?
                    const navListSpec = {
                        section: section,
                        viewPath: spec.viewPath
                    }
                    return (
                        <BasicSideMenuItem key={sectionKey} spec={navListSpec} onItemSelect={onItemSelect} isAuthorized={isAuthorized} />
                    )
                })
            }

        </BasicDrawer>
    )
}

export default BasicSideMenu





