import React from 'react'

import type { Spec } from './basic-types'

import { Default, Exact, Gubu, Skip } from 'gubu'
import { BasicEntityCheckboxField } from './BasicEntityCheckboxField'
import { BasicEntityAutocompleteField } from './BasicEntityAutocompleteField'
import { BasicEntitySliderField } from './BasicEntitySliderField'
import { BasicEntityRadioGroupField } from './BasicEntityRadioGroupField'
import { BasicEntityTextBoxField } from './BasicEntityTextBoxField'
import { BasicEntityTextField } from './BasicEntityTextField'
import { BasicEntityDateField } from './BasicEntityDateField'
import { BasicEntityTimeField } from './BasicEntityTimeField'
import { BasicEntityDateTimeField } from './BasicEntityDateTimeField'
import { BasicEntityRatingField } from './BasicEntityRatingField'

const CMPNAME = 'BasicEntityField'

const { Open } = Gubu
const BasicEntityFieldSpecShape = Gubu(
  Open({
    field: Open({
      id: String,
      name: String,
      kind: Skip(String),
      label: Default('', String),
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
          'Rating'
        ),
        edit: Default(true),
        rows: Default(3),
        props: Open({}),
      }),
    }),
  }),
  { name: CMPNAME }
)

const fieldMap: any = {
  Text: BasicEntityTextField,
  TextBox: BasicEntityTextBoxField,
  Date: BasicEntityDateField,
  DateTime: BasicEntityDateTimeField,
  Time: BasicEntityTimeField,
  Checkbox: BasicEntityCheckboxField,
  Autocomplete: BasicEntityAutocompleteField,
  Slider: BasicEntitySliderField,
  RadioGroup: BasicEntityRadioGroupField,
  Rating: BasicEntityRatingField,
}

function BasicEntityField(props: any) {
  const { ctx, spec } = props

  const basicEntityFieldSpec: Spec = BasicEntityFieldSpecShape(spec)
  const field: any = basicEntityFieldSpec.field
  const Field: any = fieldMap[field.ux.kind]

  // console.log('BEF ERR', spec)

  return <Field ctx={ctx} spec={spec} />
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
