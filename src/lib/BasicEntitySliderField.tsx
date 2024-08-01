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
  const { control, field, getValues, errors } = basicEntityAutocompleteField

  // if cmp not ready, call seneca.add('modify:edit') and seneca.add('modify:save')
  const val = getValues(field.name) // field.name + '_uival$'
  const err = errors[field.name]

  const { field: controllerField } = useController({
    name: field.name,
    control,
    defaultValue: val || field.ux.min,
  })

  return (
    <div>
      <FormLabel key={`${field.id}-label`}>{field.label}</FormLabel>
      <Slider
        key={`${field.id}-slider`}
        step={field.ux.step}
        marks={resolveMarks(field.ux.props.marks)}
        min={field.ux.min}
        max={field.ux.max}
        value={controllerField.value}
        onChange={(_, newVal) => controllerField.onChange(newVal)}
        disabled={!field.ux.edit}
        orientation={field.ux.direction}
        track={field.ux.track}
        valueLabelDisplay={field.ux.props.valueLabelDisplay}
      />
      <BasicEntityFieldError err={err} />
    </div>
  )
}

// function BasicEntitySliderField (props: any) {
//   const { spec } = props

//   const basicEntityAutocompleteField: Spec =
//     BasicEntitySliderFieldSpecShape(spec)
//   const { control, field, getValues, errors } = basicEntityAutocompleteField

//   // if cmp not ready, call seneca.add('modify:edit') and seneca.add('modify:save')
//   const val = getValues(field.name) // field.name + '_uival$'

//   const err = errors[field.name]

//   return (
//     <>
//       <FormLabel key={`${field.id}-label`}>{field.label}</FormLabel>
//       <Controller
//         key={`${field.id}-controller`}
//         name={field.name}
//         control={control}
//         defaultValue={val || field.ux.min}
//         render={({ field: { onChange, value } }) => (
//           <Slider
//             step={field.ux.step}
//             marks={resolveMarks(field.ux.props.marks)}
//             min={field.ux.min}
//             max={field.ux.max}
//             value={value}
//             onChange={(_, newVal: any) => onChange(newVal)}
//             disabled={!field.ux.edit}
//             orientation={field.ux.direction}
//             track={field.ux.track}
//             valueLabelDisplay={field.ux.props.valueLabelDisplay}
//           />
//         )}
//       />
//       <BasicEntityFieldError err={err} />
//     </>
//   )
// }

function resolveMarks (marks: any) {
  if (
    !marks ||
    (typeof marks === 'object' && Object.keys(marks).length === 0)
  ) {
    return false
  }
  if (typeof marks === 'object') {
    return Object.entries(marks).map(([key, value]) => ({
      label: value,
      value: +key,
    }))
  }

  return marks
}

export { BasicEntitySliderField }
