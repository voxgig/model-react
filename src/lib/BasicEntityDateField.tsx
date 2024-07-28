import React from 'react'
import { TextField } from '@mui/material'

import type { Spec } from './basic-types'

import { Default, Exact, Gubu, Skip } from 'gubu'
const CMPNAME = 'BasicEntityDateField'

const { Open } = Gubu
const BasicEntityDateFieldSpecShape = Gubu(
  Open({
    field: Open({
      id: String,
      name: String,
      kind: '',
      label: '',
      ux: Open({
        kind: Exact('Date'),
        edit: Default(true),
        props: Open({}),
      }),
    }),
  }),
  { name: CMPNAME }
)

function BasicEntityDateField(props: any) {
  const { spec } = props

  const basicEntityDateField: Spec = BasicEntityDateFieldSpecShape(spec)
  const { field, getValues, register } = basicEntityDateField
  const val = getValues(field.name)

  return (
    <div key={field.id}>
      <TextField
        id={field.id}
        name={field.name}
        label={field.label}
        fullWidth
        variant="outlined"
        type="date"
        disabled={!field.ux.edit}
        InputLabelProps={{ shrink: val?.length > 0 }}
        {...register(field.name)}
      />
    </div>
  )
}

export { BasicEntityDateField }
