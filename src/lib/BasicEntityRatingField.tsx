import React from 'react'

import { Rating, FormLabel } from '@mui/material'
import { Controller } from 'react-hook-form'

import type { Spec } from './basic-types'

import { Default, Exact, Gubu, Skip } from 'gubu'
const CMPNAME = 'BasicEntitySliderField'

const { Open } = Gubu
const BasicEntityRatingFieldSpecShape = Gubu(
  Open({
    field: Open({
      id: String,
      name: String,
      kind: '',
      label: '',
      ux: Open({
        kind: Exact('Rating'),
        edit: Default(true),
        precision: 1,
        props: Open({}),
      }),
    }),
  }),
  { name: CMPNAME }
)

function BasicEntityRatingField(props: any) {
  const { spec } = props

  const basicEntityRatingField: Spec = BasicEntityRatingFieldSpecShape(spec)
  const { control, field, getValues } = basicEntityRatingField
  const val = getValues(field.name)

  //   console.log("BasicEntityRatingField", "val", val);

  return (
    <div key={`${field.id}-div`}>
      <FormLabel component="legend">{field.label}</FormLabel>
      <Controller
        key={`${field.id}-controller`}
        name={field.name}
        control={control}
        defaultValue={!!val || 0}
        render={({ field: { onChange, value } }) => (
          <Rating
            name={field.name}
            value={value}
            precision={field.ux.precision}
            onChange={(_, newValue) => onChange(newValue)}
            disabled={!field.ux.edit}
            {...field.ux.props}
          />
        )}
      />
    </div>
  )
}

export { BasicEntityRatingField }
