import React from 'react'

import { FormControlLabel, RadioGroup, Radio, FormLabel } from '@mui/material'
import { useController } from 'react-hook-form'

import type { Spec } from './basic-types'

import { Default, Exact, Gubu } from 'gubu'
import { BasicEntityFieldError } from './BasicEntityFieldError'
const CMPNAME = 'BasicEntitySliderField'

const { Open } = Gubu
const BasicEntityRadioGroupFieldSpecShape = Gubu(
  Open({
    field: Open({
      id: String,
      name: String,
      kind: '',
      llabel: '',
      ux: Open({
        kind: Exact('RadioGroup'),
        edit: Default(true),
        direction: Exact('row', 'column').Default('row'),
      }),
      cat: Open({
        default: '',
        title: String,
        order: {
          sort: '',
          exclude: '',
          include: '',
        },
        item: Open({}),
      }),
    }),
  }),
  { name: CMPNAME }
)

function BasicEntityRadioGroupField (props: any) {
  const { spec } = props

  const basicEntityRadioGroupField: Spec =
    BasicEntityRadioGroupFieldSpecShape(spec)
  const { control, field, errors } = basicEntityRadioGroupField

  const err = errors[field.name]

  const {
    field: controllerField,
    fieldState: { error },
  } = useController({
    name: field.name,
    control,
    defaultValue: field.cat.default,
  })

  return (
    <>
      <FormLabel key={`${field.id}-label`}>{field.label}</FormLabel>
      <RadioGroup
        key={field.id}
        value={controllerField.value}
        onChange={controllerField.onChange}
        row={'row' === field.ux.direction}
        disabled={!field.ux.edit}
        {...field.ux.props}
      >
        {resolveCategories(field.cat).map((option: any) => (
          <FormControlLabel
            key={`${option.key}-option`}
            value={option.key}
            control={<Radio disabled={!field.ux.edit} />}
            label={option.title}
          />
        ))}
      </RadioGroup>
      <BasicEntityFieldError err={err} />
    </>
  )
}

// function BasicEntityRadioGroupField (props: any) {
//   const { spec } = props

//   const basicEntityRadioGroupField: Spec = BasicEntityRadioGroupFieldSpecShape(spec)
//   const { control, field, errors } = basicEntityRadioGroupField

//   const err = errors[field.name]

//   return (
//     <>
//       <FormLabel key={`${field.id}-label`}>{field.label}</FormLabel>
//       <Controller
//         key={`${field.id}-controller`}
//         name={field.name}
//         control={control}
//         defaultValue={field.cat.default}
//         render={({ field: { onChange, value } }) => (
//           <RadioGroup
//             key={field.id}
//             value={value}
//             onChange={onChange}
//             row={'row' === field.ux.direction}
//             disabled={!field.ux.edit}
//             {...field.ux.props}
//           >
//             {resolveCategories(field.cat).map((option: any) => (
//               <FormControlLabel
//                 key={`${option.key}-option`}
//                 value={option.key}
//                 control={<Radio disabled={!field.ux.edit} />}
//                 label={option.title}
//               />
//             ))}
//           </RadioGroup>
//         )}
//       />
//       <BasicEntityFieldError err={err} />
//     </>
//   )
// }

export function resolveCategories (cat: any) {
  return Object.keys(cat.item).map((key) => ({
    title: cat.item?.[key]?.title,
    key: key,
  }))
}

export function resolveDefault (cat: any) {
  const { default: defaultValues } = cat
  return defaultValues
}

export { BasicEntityRadioGroupField }
