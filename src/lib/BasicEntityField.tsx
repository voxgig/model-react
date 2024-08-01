import React, { useEffect, useState } from 'react'

import type { Spec } from './basic-types'

import { Default, Exact, Gubu, Skip } from 'gubu'
import { VxgBasicEntityFieldPlugin } from './VxgBasicEntityFieldPlugin'

const CMPNAME = 'BasicEntityField'

const { Open } = Gubu
const BasicEntityFieldSpecShape = Gubu(
  Open({
    field: Open({
      id: String,
      name: String,
      kind: '',
      label: '',
      ux: Open({
        kind: Exact(
          'Text',
          'TextBox',
          'Date',
          'DateTime',
          'Time',
          'Checkbox',
          'Autocomplete',
          'Slider',
          'RadioGroup',
          'Rating',
          'Button',
          'ButtonGroup',
          'Select',
          'Switch',
          'ToggleButton'
        ),
        edit: Default(true),
        rows: Default(3),
        props: Open({}),
      }),
    }),
  }),
  { name: CMPNAME }
)

function BasicEntityField (props: any) {
  const { ctx, spec } = props
  const { seneca } = ctx()

  const basicEntityField: Spec = BasicEntityFieldSpecShape(spec)
  const [plugin, setPlugin] = useState(false)

  useEffect(() => {
    if (!plugin) {
      // TODO: plugin name needs to be unique across system (use field.name, view ...)
      seneca.use({
        tag: basicEntityField.field.name,
        define: VxgBasicEntityFieldPlugin,
        options: {
          spec: {
            field: basicEntityField.field,
          },
          setPlugin,
        },
      })
    }
  }, [])

  const { Field } = seneca.export(
    'VxgBasicEntityFieldPlugin$' + spec.field.name + '/handle'
  ) || { Field: null }

  return Field ? <Field ctx={ctx} spec={basicEntityField} /> : <div></div>
}

/*
function BasicEntityDateTimeField (props: any) {
  const { spec } = props

  const field = spec.field
  const register = spec.register

  return (
    <TextField
      id={field.id}
      name={field.name}
      label={field.label}
      fullWidth
      variant="outlined"
      disabled={!field.ux.edit}
      value=" "
      InputProps={{
        inputComponent: forwardRef(()=>
          <div
            className="MuiInputBase-input MuiOutlinedInput-input"
            style={{padding:'16px'}}
          >
        <input
          id={field.id+'_date$'}
          name={field.name+'_date$'}
          type="date"
          disabled={!field.ux.edit}
          {...register(field.name+'_date$')}
        />
        <input
          id={field.id+'_time$'}
          name={field.name+'_time$'}
          type="time"
          disabled={!field.ux.edit}
          {...register(field.name+'_time$')} 
        />
      </div>
        ),
      }}
    />
  )
}
*/

/* Notes

https://www.react-hook-form.com/
https://seanconnolly.dev/react-hook-form-material-ui
https://www.bugpilot.com/guides/en/using-material-ui-react-hook-form-cf8e
https://blog.logrocket.com/using-material-ui-with-react-hook-form/

https://mui.com/material-ui/react-grid/

 */

export { BasicEntityField }
