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
      label: '',
      options: Open({
        label: { field: 'label' },
        value: { field: 'value' },
        ents: Open({}),
      }),
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
          <ButtonGroup disabled={!field.ux.edit} {...field.ux.props}>
            {Object.entries(field.options.ents).map(
              ([key, val]: [any, any]) => (
                <Button
                  key={`${field.id}-${key}`}
                  onClick={() => {
                    // Handle the click
                  }}
                >
                  {val?.[field.options.label.field]}
                </Button>
              )
            )}
          </ButtonGroup>
        )}
      />
    </div>
  )
}

export { BasicEntityButtonGroupField }
