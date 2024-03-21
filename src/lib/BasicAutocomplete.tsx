import {
  TextField,
  Autocomplete,
  createFilterOptions,
  ThemeProvider
} from '@mui/material'
import { Exact, Gubu } from 'gubu'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

// Define spec shape with Gubu
const BasicAutocompleteShape = Gubu({
  tooldef: {
    kind: Exact('addbutton', 'autocomplete'),
    label: String,
    defaultvalue: String,
    multiple: false,
    forcePopupIcon: false,
    options: {
      kind: String,
      label: {
        field: String
      },
      ent: String
    },
    name: ''
  }
})

interface BasicAutocompleteProps {
  ctx: any
  spec: any
  vxg?: any
}

function BasicAutocomplete (props: BasicAutocompleteProps) {
  const { ctx } = props
  const { seneca } = ctx()

  // spec shape validation with Gubu
  const basicAutocompleteSpec = BasicAutocompleteShape(props.spec)

  const { tooldef } = basicAutocompleteSpec
  let optionState: any
  let options: any = []
  let selected: any = []
  let canon: any = 'fox/project'

  const [value, setValue] = useState<any | null>([])

  // const optionState = useSelector(
  //   (state: any) => state.main.vxg.ent.meta.main['fox/project'].state
  // )

  // populate options and value for autocomplete
  if ('ent' === tooldef.options.kind) {
    canon = tooldef.options.ent
    optionState = useSelector(
      (state: any) => state.main.vxg.ent.meta.main[canon].state
    )

    options = useSelector((state: any) => state.main.vxg.ent.list.main[canon])
    selected = useSelector(
      (state: any) => state.main.vxg.cmp.BasicHead.tool[tooldef.name].selected
    )
  }

  useEffect(() => {
    if (optionState === 'none') {
      seneca.entity(canon).list$()
    }
    if (
      optionState === 'loaded' &&
      selected !== undefined &&
      Array.isArray(selected)
    ) {
      setValue(options.filter((option: any) => selected.includes(option.id)))
    }
  }, [optionState, options])

  const theme = ctx().theme

  return (
    <ThemeProvider theme={theme}>
      <Autocomplete
        multiple={tooldef.multiple || false}
        freeSolo
        forcePopupIcon={tooldef.forcePopupIcon || false}
        onChange={async (event: any, newValue: any) => {
          console.log(newValue)
          setValue(newValue)
          await seneca.post('aim:app,set:state', {
            section: `vxg.cmp.BasicHead.tool.${tooldef.name}`,
            content: {
              selected: [...newValue.map((option: any) => option.id)]
            }
          })
        }}
        key={tooldef.name}
        value={value || []}
        options={options}
        getOptionLabel={(option: any) =>
          option ? option[tooldef?.options?.label?.field] : null
        }
        size='small'
        renderInput={params => <TextField {...params} label={tooldef.label} />}
      />
    </ThemeProvider>
  )
}

export default BasicAutocomplete

// const filter = createFilterOptions()

// function resolveOptions (tooldef: any, options: any) {
//   let resolvedOptions = []

//   if ('ent' === tooldef.options.kind && options) {
//     console.log('resolveOptions-options', options)
//     let ents = options.ents || []
//     resolvedOptions = ents.map((ent: any) => ({
//       label: ent[tooldef.options.label.field],
//       ent
//     }))
//   }

//   console.log('resolvedOptions', resolvedOptions)

//   return resolvedOptions
// }
