import React from 'react'

import { Button, ButtonGroup } from '@mui/material'
import { Controller } from 'react-hook-form'

import type { Spec } from './basic-types'

import { Default, Exact, Gubu, Skip } from 'gubu'
const CMPNAME = 'BasicEntitySliderField'

const { Open } = Gubu
const BasicEntityButtonGroupFieldSpecShape = Gubu(
  Open({
    field: Open({
      id: String,
      name: String,
      kind: '',
      label: String,
      ux: Open({
        kind: Exact('ButtonGroup'),
        edit: Default(true),
        props: Open({}),
      }),
    }),
  }),
  { name: CMPNAME }
)

function BasicEntityButtonGroupField(props: any) {
  const { spec } = props

  const basicEntityButtonGroupField: Spec =
    BasicEntityButtonGroupFieldSpecShape(spec)
  const { control, field } = basicEntityButtonGroupField
  //   const val = getValues(field.name)

  return (
    <div key={`${field.id}-div`}>
      <Controller
        key={`${field.id}-controller`}
        name={field.name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <ButtonGroup {...field.ux.props}>
            {Object.entries(field.options.ents).map(([key, value]) => (
              <Button
                key={`${field.id}-${key}`}
                onClick={() => onChange(value)}
              >
                {field.options.ents?.[key]?.[field.options.label.field]}
              </Button>
            ))}
          </ButtonGroup>
        )}
      />
    </div>
  )
}

export { BasicEntityButtonGroupField }
