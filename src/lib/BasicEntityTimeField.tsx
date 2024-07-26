import React from 'react'
import { TextField } from '@mui/material'

import type { Spec } from './basic-types'

import { Default, Exact, Gubu, Skip } from 'gubu'
const CMPNAME = 'BasicEntityTimeField'

const { Open } = Gubu
const BasicEntityTimeFieldSpecShape = Gubu(
  Open({
    field: Open({
      id: String,
      name: String,
      kind: Skip(String),
      label: Default('', String),
      ux: Open({
        kind: Exact('Time'),
        edit: Default(true),
        props: Open({}),
      }),
    }),
  }),
  { name: CMPNAME }
)

function BasicEntityTimeField(props: any) {
  const { spec } = props

  const basicEntityTimeField: Spec = BasicEntityTimeFieldSpecShape(spec)
  const { field, getValues, register } = basicEntityTimeField

  const val = getValues(field.name)

  return (
    <div key={field.id}>
      <TextField
        id={field.id}
        name={field.name}
        label={field.label}
        fullWidth
        variant="outlined"
        type="time"
        disabled={!field.ux.edit}
        InputLabelProps={{ shrink: val?.length > 0 }}
        {...register(field.name)}
      />
    </div>
  )
}

export { BasicEntityTimeField }
