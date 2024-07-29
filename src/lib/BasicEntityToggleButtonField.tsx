import React from 'react'

import {
  Button,
  ButtonGroup,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'
import { Controller } from 'react-hook-form'

import type { Spec } from './basic-types'

import { Default, Exact, Gubu, Skip } from 'gubu'
const CMPNAME = 'BasicEntitySliderField'

const { Open } = Gubu
const BasicEntityToggleButtonFieldSpecShape = Gubu(
  Open({
    field: Open({
      id: String,
      name: String,
      kind: '',
      label: '',
      options: Open({
        label: { field: 'label' },
        value: { field: 'value' },
        ents: Open({}),
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

function BasicEntityToggleButtonField(props: any) {
  const { spec } = props

  const basicEntityToggleButtonField: Spec =
    BasicEntityToggleButtonFieldSpecShape(spec)
  const { control, field } = basicEntityToggleButtonField
  //   const val = getValues(field.name)

  return (
    <div key={`${field.id}-div`}>
      <Controller
        key={`${field.id}-controller`}
        name={field.name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <ToggleButtonGroup
            value={value}
            onChange={onChange}
            disabled={!field.ux.edit}
            {...field.ux.props}
          >
            {Object.entries(field.options.ents).map(
              ([key, val]: [any, any]) => (
                <ToggleButton key={`${field.id}-${key}`} value={key}>
                  {val?.[field.options.label.field]}
                </ToggleButton>
              )
            )}
          </ToggleButtonGroup>
        )}
      />
    </div>
  )
}

export { BasicEntityToggleButtonField }
