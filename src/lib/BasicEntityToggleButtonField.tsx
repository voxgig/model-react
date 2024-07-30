import React from 'react'

import { FormLabel, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { Controller } from 'react-hook-form'

import type { Spec } from './basic-types'

import { Default, Exact, Gubu } from 'gubu'
import { BasicEntityFieldError } from './BasicEntityFieldError'
const CMPNAME = 'BasicEntitySliderField'

const { Open } = Gubu
const BasicEntityToggleButtonFieldSpecShape = Gubu(
  Open({
    field: Open({
      id: String,
      name: String,
      kind: '',
      label: '',
      cat: Open({
        default: '',
        title: String,
        multiple: Number,
        order: {
          sort: '',
          exclude: '',
          include: '',
        },
        item: Open({}),
      }),
      ux: Open({
        kind: Exact('ToggleButton'),
        edit: Default(true),
        props: Open({}),
      }),
    }),
  }),
  { name: CMPNAME }
)

function BasicEntityToggleButtonField (props: any) {
  const { spec } = props

  const basicEntityToggleButtonField: Spec =
    BasicEntityToggleButtonFieldSpecShape(spec)
  const { control, field, errors } = basicEntityToggleButtonField

  const err = errors[field.name]

  return (
    <div key={`${field.id}-box`}>
      <FormLabel component='legend'>{field.label}</FormLabel>
      <Controller
        key={`${field.id}-controller`}
        name={field.name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <ToggleButtonGroup
            value={value}
            exclusive={field.cat.multiple === 1 ? true : false}
            onChange={(_, v) => {
              field.cat.multiple === 1 ? onChange(v) : onChange([v])
            }}
            disabled={!field.ux.edit}
            {...field.ux.props}
          >
            {Object.entries(field.cat.item).map(([key, val]: [any, any]) => (
              <ToggleButton key={`${field.id}-${key}`} value={key}>
                {val?.title}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        )}
      />
      <BasicEntityFieldError err={err} />
    </div>
  )
}

export { BasicEntityToggleButtonField }
