import React from 'react'
import { TextField } from '@mui/material'

import type { Spec } from './basic-types'

import { Default, Exact, Gubu, Skip } from 'gubu'
import { BasicEntityFieldError } from './BasicEntityFieldError'
const CMPNAME = 'BasicEntityTextField'

const { Open } = Gubu
const BasicEntityTextFieldSpecShape = Gubu(
  Open({
    field: Open({
      id: String,
      name: String,
      kind: '',
      label: '',
      ux: Open({
        kind: Exact('Text'),
        edit: Default(true),
        props: Open({}),
      }),
    }),
  }),
  { name: CMPNAME }
)

function BasicEntityTextField(props: any) {
  const { spec } = props

  const basicEntityTextBoxField: Spec = BasicEntityTextFieldSpecShape(spec)
  const { field, getValues, register, errors } = basicEntityTextBoxField
  const val = getValues(field.name)

  const err = errors[field.name]
  // console.log('BET', err, field.name, errors)

  return (
    <div key={field.id}>
      <TextField
        id={field.id}
        name={field.name}
        label={field.label}
        fullWidth
        variant="outlined"
        InputLabelProps={{ shrink: val?.length > 0 }}
        {...register(field.name)}
        disabled={!field.ux.edit}
        {...field.ux.props}
      />
      <BasicEntityFieldError err={err} />
    </div>
  )
}

export { BasicEntityTextField }
