import React from 'react'
import { TextField } from '@mui/material'

import type { Spec } from './basic-types'

import { Default, Exact, Gubu, Skip } from 'gubu'
const CMPNAME = 'BasicEntityDateTimeField'

const { Open } = Gubu
const BasicEntityDateTimeFieldSpecShape = Gubu(
  Open({
    field: Open({
      id: String,
      name: String,
      kind: Skip(String),
      label: Default('', String),
      ux: Open({
        kind: Exact('DateTime'),
        edit: Default(true),
        props: Open({}),
      }),
    }),
  }),
  { name: CMPNAME }
)

function BasicEntityDateTimeField(props: any) {
  const { spec } = props

  const basicEntityDateTimeField: Spec = BasicEntityDateTimeFieldSpecShape(spec)
  const { field, getValues, register } = basicEntityDateTimeField

  const val = getValues(field.name)

  return (
    <div key={field.id}>
      <TextField
        id={field.id}
        name={field.name}
        label={field.label}
        fullWidth
        variant="outlined"
        type="datetime-local"
        disabled={!field.ux.edit}
        InputLabelProps={{ shrink: val?.length > 0 }}
        {...register(field.name)}
      />
    </div>
  )
}

export { BasicEntityDateTimeField }
