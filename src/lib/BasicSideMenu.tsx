import { Child, Gubu } from 'gubu'
import BasicSideMenuItem from './BasicSideMenuItem'

const BasicSideMenuSpecShape = Gubu({
  section: {}
  // section: Child({
  //   title: String,
  //   item: Child({
  //     kind: String,
  //     label: String,
  //     icon: String,
  //     path: String,
  //     access: Child(Boolean, {})
  //   })
  // })
})

function BasicSideMenu (props: any) {
  const { onItemSelect } = props

  const basicSideMenuSpec = BasicSideMenuSpecShape(props.spec)

  return (
    <>
      {Object.entries(basicSideMenuSpec.section).map(
        ([sectionKey, section]: [any, any]) => {
          const basicSideMenuItemSpec = {
            section
          }
          return (
            <BasicSideMenuItem
              key={sectionKey}
              spec={basicSideMenuItemSpec}
              onItemSelect={onItemSelect}
            />
          )
        }
      )}
    </>
  )
}

export default BasicSideMenu
