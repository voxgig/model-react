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
      kind: '',
      label: String,
      ux: Open({
        kind: Exact('Button'),
        edit: true,
        variant: 'contained',
        props: Open({}),
      }),
    }),
  }),
  { name: CMPNAME }
)

function BasicEntityButtonField(props: any) {
  const { spec } = props

  const basicEntityButtonField: Spec = BasicEntityButtonFieldSpecShape(spec)
  const { field } = basicEntityButtonField

  return (
    <div key={`${field.id}-div`}>
      <Button
        variant={field.ux.variant}
        disabled={!field.ux.edit}
        onClick={() => {
          // Handle the button click
          console.log('Button clicked')
        }}
        {...field.ux.props}
      >
        {field.label}
      </Button>
    </div>
  )
}

export { BasicEntityButtonField }
