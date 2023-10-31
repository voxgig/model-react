import { TextField, Autocomplete, createFilterOptions } from '@mui/material'
import { Child, Exact, Gubu } from 'gubu'

import { useSelector } from 'react-redux'

const BasicAutocompleteShape = Gubu({
  tooldef: {
    kind: Exact('addbutton', 'autocomplete'),
    label: String,
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

function BasicAutocomplete (props: any) {
  const { ctx } = props
  const { seneca } = ctx()

  // spec schema validation with Gubu
  const basicAutocompleteSpec = BasicAutocompleteShape(props.spec)

  const { tooldef } = basicAutocompleteSpec

  let data = {}
  let value = {}

  if ('ent' === tooldef.options.kind) {
    let canon = tooldef.options.ent
    data = {
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
  }

  return (
    <Autocomplete
      freeSolo
      forcePopupIcon
      value={value || tooldef.defaultvalue || ''}
      key={tooldef.name}
      options={resolveOptions(tooldef, data)}
      // disableClearable={ typeof vxg.cmp.BasicHead.tool[tooldef.name].selected != 'object' }
      size='small'
      sx={{
        paddingLeft: '1em',
        width: '20rem'
      }}
      filterOptions={(options: any, params: any) => {
        const filtered = filter(options, params)
        // const { inputValue } = params
        return filtered
      }}
      renderInput={params => <TextField {...params} label={tooldef.label} />}
      onChange={(event: any, newval: any) => {
        seneca.act('aim:app,set:state', {
          section: 'vxg.cmp.BasicHead.tool.' + tooldef.name + '.selected',
          content:
            'search' == tooldef.mode && typeof newval === 'string'
              ? { [tooldef.options.label.field]: newval }
              : newval?.ent
        })
      }}
      isOptionEqualToValue={(opt: any, val: any) =>
        opt === val ||
        (null != opt && null != val && opt.ent?.id === val.ent?.id)
      }
    />
  )
}

export default BasicAutocomplete

const filter = createFilterOptions()

function resolveOptions (tooldef: any, data: any) {
  let options = []

  if ('ent' === tooldef.options.kind && data) {
    let ents = data.ents || []
    options = ents.map((ent: any) => ({
      label: ent[tooldef.options.label.field],
      ent
    }))
  }

  return options
}
