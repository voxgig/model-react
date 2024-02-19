import {
  TextField,
  Autocomplete,
  createFilterOptions,
  ThemeProvider
} from '@mui/material'
import { Exact, Gubu } from 'gubu'
import { useSelector } from 'react-redux'

// Define spec shape with Gubu
const BasicAutocompleteShape = Gubu({
  tooldef: {
    kind: Exact('addbutton', 'autocomplete'),
    label: String,
    defaultvalue: String,
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
  let options = {}
  let value: any = {}

  // populate options and value for autocomplete
  if ('ent' === tooldef.options.kind) {
    let canon = tooldef.options.ent
    options = {
      ents: useSelector((state: any) => state.main.vxg.ent.list.main[canon])
    }

    let selected = useSelector(
      (state: any) => state.main.vxg.cmp.BasicHead.tool[tooldef.name].selected
    )

    if (selected) {
      value = {
        label: selected[tooldef.options.label.field],
        ent: selected
      }
    }

    console.log('value', value)
  }

  const theme = ctx().theme

  return (
    <ThemeProvider theme={theme}>
      <Autocomplete
        multiple={true}
        freeSolo
        forcePopupIcon
        // value={value.label || tooldef.defaultvalue || ""}
        key={tooldef.name}
        options={resolveOptions(tooldef, options)}
        // disableClearable={ typeof vxg.cmp.BasicHead.tool[tooldef.name].selected != 'object' }
        size='small'
        filterOptions={(options: any, params: any) => {
          const filtered = filter(options, params)
          // const { inputValue } = params
          return filtered
        }}
        renderInput={params => <TextField {...params} label={tooldef.label} />}
        // onChange={(newval: any) => {
        //   seneca.act("aim:app,set:state", {
        //     section: "vxg.cmp.BasicHead.tool." + tooldef.name + ".selected",
        //     content:
        //       "search" == tooldef.mode && typeof newval === "string"
        //         ? { [tooldef.options.label.field]: newval }
        //         : newval?.ent,
        //   });
        // }}
        // isOptionEqualToValue={(opt: any, val: any) =>
        //   opt === val ||
        //   (null != opt && null != val && opt.ent?.id === val.ent?.id)
        // }
      />
    </ThemeProvider>
  )
}

export default BasicAutocomplete

const filter = createFilterOptions()

function resolveOptions(tooldef: any, options: any) {
  let resolvedOptions = []

  if ('ent' === tooldef.options.kind && options) {
    let ents = options.ents || []
    resolvedOptions = ents.map((ent: any) => ({
      label: ent[tooldef.options.label.field],
      ent
    }))
  }

  return resolvedOptions
}
