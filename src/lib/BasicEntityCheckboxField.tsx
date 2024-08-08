import React from 'react'

import { FormControlLabel, Checkbox, Box } from '@mui/material'
import { useController } from 'react-hook-form'

import type { Spec } from './basic-types'

import { Default, Exact, Gubu, Skip } from 'gubu'
import { BasicEntityFieldError } from './BasicEntityFieldError'
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

function BasicEntityCheckboxField (props: any) {
  const { spec } = props

  const basicEntityCheckboxField: Spec = BasicEntityCheckboxFieldSpecShape(spec)
  const { control, field, getValues, errors } = basicEntityCheckboxField
  const val = getValues(field.name)
  const err = errors[field.name]

  const {
    field: controllerField,
    fieldState: { error },
  } = useController({
    name: field.name,
    control,
    defaultValue: !!val,
  })

  // TODO: Style wrapper box
  return (
    <Box key={`${field.id}-box`}>
      <FormControlLabel
        control={
          <Checkbox
            id={field.id}
            checked={controllerField.value}
            onChange={controllerField.onChange}
            disabled={!field.ux.edit}
            {...field.ux.props}
          />
        }
        label={field.label}
      />
      <BasicEntityFieldError err={err} />
    </Box>
  )
}

// function BasicEntityCheckboxField (props: any) {
//   const { spec } = props

//   const basicEntityCheckboxField: Spec = BasicEntityCheckboxFieldSpecShape(spec)
//   const { control, field, getValues, errors } = basicEntityCheckboxField
//   const val = getValues(field.name)

//   const err = errors[field.name]

//   // TODO: Style wrapper box
//   return (
//     <Box key={`${field.id}-box`}>
//       <FormControlLabel
//         control={
//           <Controller
//             key={`${field.id}-controller`}
//             name={field.name}
//             control={control}
//             defaultValue={!!val}
//             render={({ field: { onChange, value } }) => (
//               <Checkbox
//                 id={field.id}
//                 checked={value}
//                 onChange={onChange}
//                 disabled={!field.ux.edit}
//                 {...field.ux.props}
//               />
//             )}
//           />
//         }
//         label={field.label}
//       />
//       <BasicEntityFieldError err={err} />
//     </Box>
//   )
// }

export { BasicEntityCheckboxField }
