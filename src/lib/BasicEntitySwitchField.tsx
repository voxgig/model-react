import React, { useEffect, forwardRef } from 'react'

import { FormControlLabel, Box, Switch } from '@mui/material'
import { Controller } from 'react-hook-form'

import type { Spec } from './basic-types'

import { Default, Exact, Gubu } from 'gubu'
import { BasicEntityFieldError } from './BasicEntityFieldError'
const CMPNAME = 'BasicEntitySliderField'

const { Open } = Gubu
const BasicEntitySwitchFieldSpecShape = Gubu(
  Open({
    field: Open({
      id: String,
      name: String,
      kind: '',
      label: '',
      ux: Open({
        kind: Exact('Switch'),
        edit: Default(true),
        props: Open({}),
      }),
    }),
  }),
  { name: CMPNAME }
)

function BasicEntitySwitchField (props: any) {
  const { spec } = props

  const basicEntitySwitchField: Spec = BasicEntitySwitchFieldSpecShape(spec)
  const { control, field, getValues, errors } = basicEntitySwitchField
  const val = getValues(field.name)

  const err = errors[field.name]

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
              <Switch
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
      <BasicEntityFieldError err={err} />
    </Box>
  )
}

export { BasicEntitySwitchField }
