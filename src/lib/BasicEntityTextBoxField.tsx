import React from 'react'
import { TextField } from '@mui/material'

import type { Spec } from './basic-types'

import { Default, Exact, Gubu, Skip } from 'gubu'
import { BasicEntityFieldError } from './BasicEntityFieldError'
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
function BasicEntityTextBoxField (props: any) {
  const { spec } = props

  const basicEntityTextBoxField: Spec = BasicEntityTextBoxFieldSpecShape(spec)
  const { field, getValues, register, errors } = basicEntityTextBoxField
  const val = getValues(field.name)

  const err = errors[field.name]

  return (
    <div key={field.name}>
      <TextField
        id={field.id}
        name={field.name}
        label={field.label}
        variant='outlined'
        fullWidth
        multiline
        rows={field.ux.rows}
        InputLabelProps={{ shrink: val?.length > 0 }}
        disabled={!field.ux.edit}
        {...field.ux.props}
        {...register(field.name)}
      />
      <BasicEntityFieldError err={err} />
    </div>
  )
}

export { BasicEntityTextBoxField }
