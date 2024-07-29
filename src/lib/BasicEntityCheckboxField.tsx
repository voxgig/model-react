import React, { useEffect, forwardRef } from 'react'

import { FormControlLabel, Checkbox, Box } from '@mui/material'
import { Controller } from 'react-hook-form'

import type { Spec } from './basic-types'

import { Default, Exact, Gubu, Skip } from 'gubu'
const CMPNAME = 'BasicEntitySliderField'

const { Open } = Gubu
const BasicEntityCheckboxFieldSpecShape = Gubu(
  Open({
    field: Open({
      id: String,
      name: String,
      kind: '',
      label: '',
      ux: Open({
        kind: Exact('Checkbox'),
        edit: Default(true),
        props: Open({}),
      }),
    }),
  }),
  { name: CMPNAME }
)

function BasicEntityCheckboxField(props: any) {
  const { spec } = props

  const basicEntityCheckboxField: Spec = BasicEntityCheckboxFieldSpecShape(spec)
  const { control, field, getValues } = basicEntityCheckboxField
  const val = getValues(field.name)

  // TODO: Style wrapper box
  return (
    <Box key={`${field.id}-box`}>
      <FormControlLabel
        control={
          <Controller
            key={`${field.id}-controller`}
            name={field.name}
            control={control}
            defaultValue={!!val}
            render={({ field: { onChange, value } }) => (
              <Checkbox
                id={field.id}
                checked={value}
                onChange={onChange}
                disabled={!field.ux.edit}
                {...field.ux.props}
              />
            )}
          />
        }
        label={field.label}
      />
    </Box>
  )
}

export { BasicEntityCheckboxField }
