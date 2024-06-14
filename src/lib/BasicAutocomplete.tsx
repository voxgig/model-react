import { TextField, Autocomplete, ThemeProvider } from '@mui/material'
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
    canon: String,
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

function BasicAutocomplete(props: BasicAutocompleteProps) {
  const { ctx } = props
  const { seneca } = ctx()

  // spec shape validation with Gubu
  const basicAutocompleteSpec = BasicAutocompleteShape(props.spec)

  const { tooldef } = basicAutocompleteSpec
  let options: any = []
  let selected: any = []
  const [value, setValue] = useState<any | null>([])

  const canon: any = tooldef.canon

  const optionState = useSelector(
    (state: any) => state.main.vxg.ent.meta.main[canon].state
  )

  // Populate options and value for autocomplete
  if ('ent' === tooldef.options.kind) {
    options = useSelector((state: any) => state.main.vxg.ent.list.main[canon])
    // console.log('options', options)
    selected = useSelector(
      (state: any) => state.main.vxg.cmp.BasicHead.tool[tooldef.name].selected
    )
  }

  useEffect(() => {
    if (optionState === 'loaded') {
      setValue(options[0])
    }
  }, [options])

  const theme = ctx().theme

  return (
    <ThemeProvider theme={theme}>
      <Autocomplete
        multiple={tooldef.multiple || false}
        freeSolo
        forcePopupIcon={tooldef.forcePopupIcon || false}
        onChange={async (event: any, newValue: any) => {
          console.log('Project switched', newValue)
          setValue(newValue)
          await seneca.post('aim:app,set:state', {
            section: `vxg.cmp.BasicHead.tool.${tooldef.name}`,
            content: {
              selected: newValue
            }
          })
        }}
        key={tooldef.label}
        value={value || []}
        options={options}
        getOptionLabel={(option: any) => {
          // console.log('getOptionLabel', option, typeof option)
          if (option && !Array.isArray(option)) {
            return option[tooldef.options.label.field]
          } else {
            return 'undefined'
          }
        }}
        size='small'
        renderInput={params => (
          <TextField {...params} label={tooldef.label || 'Autocomplete'} />
        )}
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
