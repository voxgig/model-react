import BasicSideMenuItem from './BasicSideMenuItem'

function BasicSideMenu(props: any) {
    const {
        isAuthorized,
        onItemSelect,
        spec
    } = props

    return (
        <>
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
        </>
    )
}

export default BasicSideMenu





