import BasicSideMenuItem from './BasicSideMenuItem'

function BasicSideMenu(props: any) {
    const {
        onItemSelect,
        spec
    } = props

    return (
        <>
            {
                Object.entries(spec.sectionList).map(([sectionKey, section]: [any, any]) => {
                    // TODO: do we need to pass viewPath?
                    const basicSideMenuItemSpec = {
                        section: section
                    }
                    return (
                        <BasicSideMenuItem key={sectionKey} spec={basicSideMenuItemSpec} onItemSelect={onItemSelect} />
                    )
                })
            }
        </>
    )
}

export default BasicSideMenu





