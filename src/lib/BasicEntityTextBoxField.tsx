import React from 'react'
import { TextField } from '@mui/material'

import type { Spec } from './basic-types'

import { Default, Exact, Gubu, Skip } from 'gubu'
const CMPNAME = 'BasicEntityTextBoxField'

const { Open } = Gubu
const BasicEntityTextBoxFieldSpecShape = Gubu(
  Open({
    field: Open({
      id: String,
      name: String,
      kind: '',
      label: '',
      ux: Open({
        kind: Exact('TextBox'),
        edit: Default(true),
        props: Open({}),
      }),
    }),
  }),
  { name: CMPNAME }
)

// TODO: Decide on naming convention for TextBox
function BasicEntityTextBoxField(props: any) {
  const { spec } = props

  const basicEntityTextBoxField: Spec = BasicEntityTextBoxFieldSpecShape(spec)
  const { field, getValues, register } = basicEntityTextBoxField
  const val = getValues(field.name)

  return (
    <div key={field.name}>
      <TextField
        id={field.id}
        name={field.name}
        label={field.label}
        variant="outlined"
        fullWidth
        multiline
        rows={field.ux.rows}
        InputLabelProps={{ shrink: val?.length > 0 }}
        {...register(field.name)}
        disabled={!field.ux.edit}
        {...field.ux.props}
      />
    </div>
  )
}

export { BasicEntityTextBoxField }
