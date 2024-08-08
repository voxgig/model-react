import React from 'react'

import { Rating, FormLabel } from '@mui/material'
import { useController } from 'react-hook-form'

import type { Spec } from './basic-types'

import { Default, Exact, Gubu } from 'gubu'
import { BasicEntityFieldError } from './BasicEntityFieldError'
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

function BasicEntityRatingField (props: any) {
  const { spec } = props

  const basicEntityRatingField: Spec = BasicEntityRatingFieldSpecShape(spec)
  const { control, field, getValues, errors } = basicEntityRatingField
  const val = getValues(field.name)
  const err = errors[field.name]

  const {
    field: controllerField,
    fieldState: { error },
  } = useController({
    name: field.name,
    control,
    defaultValue: !!val || 0,
  })

  return (
    <div key={`${field.id}-div`}>
      <FormLabel component='legend'>{field.label}</FormLabel>
      <Rating
        name={field.name}
        value={controllerField.value}
        precision={field.ux.precision}
        onChange={(_, newValue) => controllerField.onChange(newValue)}
        disabled={!field.ux.edit}
        {...field.ux.props}
      />
      <BasicEntityFieldError err={err} />
    </div>
  )
}

// function BasicEntityRatingField (props: any) {
//   const { spec } = props

//   const basicEntityRatingField: Spec = BasicEntityRatingFieldSpecShape(spec)
//   const { control, field, getValues, errors } = basicEntityRatingField
//   const val = getValues(field.name)

//   const err = errors[field.name]

//   return (
//     <div key={`${field.id}-div`}>
//       <FormLabel component='legend'>{field.label}</FormLabel>
//       <Controller
//         key={`${field.id}-controller`}
//         name={field.name}
//         control={control}
//         defaultValue={!!val || 0}
//         render={({ field: { onChange, value } }) => (
//           <Rating
//             name={field.name}
//             value={value}
//             precision={field.ux.precision}
//             onChange={(_, newValue) => onChange(newValue)}
//             disabled={!field.ux.edit}
//             {...field.ux.props}
//           />
//         )}
//       />
//       <BasicEntityFieldError err={err} />
//     </div>
//   )
// }

export { BasicEntityRatingField }
