import React from 'react'

import { Button } from '@mui/material'
import { Controller } from 'react-hook-form'

import type { Spec } from './basic-types'

import { Default, Exact, Gubu, Skip } from 'gubu'
const CMPNAME = 'BasicEntitySliderField'

const { Open } = Gubu
const BasicEntityButtonFieldSpecShape = Gubu(
  Open({
    field: Open({
      id: String,
      name: String,
      kind: Skip(String),
      label: Default('', String),
      ux: Open({
        kind: Exact('Button'),
        edit: Default(true),
        props: Open({}),
      }),
    }),
  }),
  { name: CMPNAME }
)

function BasicEntityButtonField(props: any) {
  const { spec } = props

  const basicEntityButtonField: Spec = BasicEntityButtonFieldSpecShape(spec)
  const { control, field } = basicEntityButtonField
  //   const val = getValues(field.name)

  return (
    <div key={`${field.id}-div`}>
      <Controller
        key={`${field.id}-controller`}
        name={field.name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Button
            name={field.name}
            value={value}
            onClick={(_) => onChange(value)}
            {...field.ux.props}
          >
            {field.label}
          </Button>
        )}
      />
    </div>
  )
}

export { BasicEntityButtonField }
