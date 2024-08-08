import React from 'react'

import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material'
import { useController } from 'react-hook-form'

import type { Spec } from './basic-types'

import { Default, Exact, Gubu } from 'gubu'
import { BasicEntityFieldError } from './BasicEntityFieldError'
import { resvalue, resdefault } from './vxg-util'
const CMPNAME = 'BasicEntitySelectField'

const { Open } = Gubu
const BasicEntitySelectFieldSpecShape = Gubu(
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
        kind: Exact('Select'),
        edit: Default(true),
      }),
    }),
  }),
  { name: CMPNAME }
)

function BasicEntitySelectField (props: any) {
  const { spec } = props

  const basicEntitySelectField: Spec = BasicEntitySelectFieldSpecShape(spec)
  const { control, field, errors } = basicEntitySelectField
  const err = errors[field.name]

  const {
    field: controllerField,
    fieldState: { error },
  } = useController({
    name: field.name,
    control,
    defaultValue: resolveDefault(field.cat),
  })

  return (
    <Box key={`${field.id}-box`}>
      <FormControl fullWidth>
        <InputLabel id={`${field.id}-label`}>{field.label}</InputLabel>
        <Select
          labelId={`${field.id}-label`}
          id={`${field.id}-select`}
          value={resolveValue(controllerField.value, field.cat)}
          multiple={field.cat.multiple !== 1}
          label={field.name}
          onChange={(event: any) => {
            const v = event.target.value
            controllerField.onChange(Array.isArray(v) ? v.join(',') : v)
          }}
          disabled={!field.ux.edit}
          {...field.ux.props}
        >
          {resolveCategories(field.cat).map((opt: any) => (
            <MenuItem key={opt.key} value={opt.key}>
              {opt.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <BasicEntityFieldError err={err} />
    </Box>
  )
}

// Returns array of options based on field.cat object
export function resolveCategories (cat: any) {
  return Object.keys(cat.item).map((key) => ({
    title: cat.item?.[key]?.title,
    key: key,
  }))
}

export function resolveDefault (cat: {
  multiple: number
  item: any
  default: string
}) {
  return resdefault(cat, (val: string, item: { title: string }) => val)
}

export function resolveValue (
  value: any,
  cat: { multiple: number; item: Record<string, { title: string }> }
) {
  return resvalue(value, cat, (val: string, item: { title: string }) => val)
}

// export function resolveDefault (cat: {
//   multiple: number
//   item: any
//   default: string
// }) {
//   const { multiple, item: items, default: defaultValues } = cat

//   if (Object.keys(items).length === 0) {
//     return multiple === 1 ? '' : []
//   }

//   const defaultItems = defaultValues.split(',')

//   const mapResolvedDefault = (list: string[]) =>
//     list.map((val: any) => (items[val] ? val : undefined))

//   switch (multiple) {
//     case 1:
//       return defaultItems[0] ? defaultItems[0] : ''
//     case -1:
//       return mapResolvedDefault(defaultItems).filter(Boolean) || []
//     default:
//       return (
//         mapResolvedDefault(defaultItems.slice(0, multiple)).filter(Boolean) ||
//         []
//       )
//   }
// }

// export function resolveValueUtil (
//   value: any,
//   cat: { multiple: number; item: Record<string, { title: string }> },
//   mapFn: (val: string, item: { title: string }) => any
// ) {
//   const { item: items, multiple } = cat

//   if (Object.keys(items).length === 0) {
//     return multiple === 1 ? '' : []
//   }

//   if (Array.isArray(value)) {
//     return multiple === 1 && value[0] ? value[0] : value.slice(0, multiple)
//   }

//   if (typeof value === 'object') {
//     return multiple === 1 ? value : [value]
//   }

//   const splitValue = value.split(',')

//   const mapValue = (val: string) =>
//     items[val] ? mapFn(val, items[val]) : undefined

//   switch (multiple) {
//     case 1:
//       return mapValue(splitValue[0]) || ''
//     case -1:
//       console.log('splitValue', splitValue)
//       console.log('items', items[splitValue[0]])
//       console.log(
//         'splitValue.map(mapValue)',
//         splitValue.map(mapValue).filter(Boolean)
//       )
//       return splitValue.map(mapValue).filter(Boolean) || []
//     default:
//       console.log('splitValue', splitValue)
//       return splitValue.slice(0, multiple).map(mapValue).filter(Boolean)
//   }
// }

// function resolveValueToKey (
//   value: any,
//   cat: { multiple: number; item: Record<string, { title: string }> }
// ) {
//   const { item: items, multiple } = cat

//   if (Object.keys(items).length === 0) {
//     return multiple === 1 ? '' : []
//   }

//   if (Array.isArray(value)) {
//     return multiple === 1 && value[0] ? value[0] : value.slice(0, multiple)
//   }

//   if (typeof value === 'object') {
//     return multiple === 1 ? value : [value]
//   }

//   const mapValue = (val: string) => (items[val] ? val : undefined)
//   const splitValue = value.split(',')

//   switch (multiple) {
//     case 1:
//       return mapValue(splitValue[0]) || ''
//     case -1:
//       return splitValue.map(mapValue).filter(Boolean) || []
//     default:
//       return splitValue.slice(0, multiple).map(mapValue).filter(Boolean) || []
//   }
// }

export { BasicEntitySelectField }
