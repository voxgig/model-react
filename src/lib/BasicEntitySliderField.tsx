import React from 'react'

import { FormLabel, Slider } from '@mui/material'
import { useController } from 'react-hook-form'

import type { Spec } from './basic-types'

import { Default, Exact, Gubu } from 'gubu'
import { BasicEntityFieldError } from './BasicEntityFieldError'
const CMPNAME = 'BasicEntitySliderField'

const { Open } = Gubu
const BasicEntitySliderFieldSpecShape = Gubu(
  Open({
    field: Open({
      id: String,
      name: String,
      kind: '',
      label: '',
      ux: Open({
        kind: Exact('Slider'),
        edit: Default(true),
        step: Default(1),
        min: Default(0),
        max: Default(100),
        props: Open({
          marks: Default({}),
          valueLabelDisplay: Exact('on', 'auto', 'off').Default('auto'),
          direction: Exact('horizontal', 'vertical').Default('horizontal'),
          track: Exact('normal', 'inverted', 'disabled').Default('normal'),
        }),
      }),
    }),
  }),
  { name: CMPNAME }
)

function BasicEntitySliderField (props: any) {
  const { spec } = props

  const basicEntityAutocompleteField: Spec =
    BasicEntitySliderFieldSpecShape(spec)
  const { control, field, getValues, setValue, errors } =
    basicEntityAutocompleteField

  const fieldName = field.name
  const val = getValues(`${fieldName}_uival$`)
  const marks = getValues(`${fieldName}_marks$`)
  const err = errors[fieldName]

  const { field: controllerField } = useController({
    name: `${fieldName}_uival$`,
    control,
    defaultValue: val || field.ux.min,
  })

  return (
    <div>
      <FormLabel key={`${field.id}-label`}>{field.label}</FormLabel>
      <Slider
        key={`${field.id}-slider`}
        step={field.ux.step}
        marks={marks}
        min={field.ux.min}
        max={field.ux.max}
        value={controllerField.value}
        onChange={(_, newVal: any) => {
          // FIXME: this should be elsewhere, and flexible
          setValue(field.name, newVal * 60)
          controllerField.onChange(newVal)
        }}
        disabled={!field.ux.edit}
        orientation={field.ux.direction}
        track={field.ux.track}
        valueLabelDisplay={field.ux.props.valueLabelDisplay}
      />
      <BasicEntityFieldError err={err} />
    </div>
  )
}

export { BasicEntitySliderField }
