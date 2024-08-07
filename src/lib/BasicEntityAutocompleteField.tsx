import React from 'react'

import { TextField, Autocomplete, Box } from '@mui/material'
import { useController } from 'react-hook-form'

import type { Spec } from './basic-types'

import { Default, Exact, Gubu } from 'gubu'
import { BasicEntityFieldError } from './BasicEntityFieldError'
import { resvalue, resdefault } from './vxg-util'
const CMPNAME = 'BasicEntityAutocompleteField'

const { Open } = Gubu
const BasicEntityAutocompleteFieldSpecShape = Gubu(
  Open({
    field: Open({
      id: String,
      label: String,
      kind: String,
      name: String,
      cat: Open({
        default: String,
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
        kind: Exact('Autocomplete'),
        edit: Default(true),
      }),
    }),
  }),
  { name: CMPNAME }
)

function BasicEntityAutocompleteField (props: any) {
  const { spec } = props

  const basicEntityAutocompleteField: Spec =
    BasicEntityAutocompleteFieldSpecShape(spec)
  const { control, field, errors } = basicEntityAutocompleteField
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
      <Autocomplete
        freeSolo
        forcePopupIcon
        multiple={field.cat.multiple !== 1}
        options={resolveCategories(field.cat)}
        isOptionEqualToValue={(opt: any, val: any) =>
          opt === val ||
          (opt?.id != null && val?.id != null && opt.id === val.id) ||
          (opt?.key != null && val?.key != null && opt.key === val.key)
        }
        getOptionLabel={(option: any) => option.title}
        value={resolveValue(controllerField.value, field.cat)}
        disabled={!field.ux.edit}
        onChange={(_, v: any) => {
          controllerField.onChange(
            Array.isArray(v) ? v.map((val) => val.key).join(',') : v?.key
          )
        }}
        renderInput={(params: any) => (
          <TextField {...params} label={field.label} />
        )}
        {...field.ux.props}
      />
      <BasicEntityFieldError err={err} />
    </Box>
  )
}

export const resolveCategories = ({
  item,
}: {
  item: Record<string, { title: string }>
}) => Object.entries(item).map(([key, { title }]) => ({ key, title }))

export function resolveDefault (cat: {
  multiple: number
  item: any
  default: string
}) {
  return resdefault(cat, (val: string, item: { title: string }) => ({
    key: val,
    title: item.title,
  }))
}

export function resolveValue (
  value: any,
  cat: { multiple: number; item: Record<string, { title: string }> }
) {
  return resvalue(value, cat, (val: string, item: { title: string }) => ({
    key: val,
    title: item.title,
  }))
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
//     list.map((val: any) => ({
//       title: items[val]?.title,
//       key: val,
//     }))

//   switch (multiple) {
//     case 1:
//       return defaultItems[0]
//         ? {
//             key: defaultItems[0],
//             title: items[defaultItems[0]]?.title,
//           }
//         : ''
//     case -1:
//       return mapResolvedDefault(defaultItems) || []
//     default:
//       return mapResolvedDefault(defaultItems.slice(0, multiple)) || []
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
//       return splitValue.map(mapValue).filter(Boolean) || []
//     default:
//       return splitValue.slice(0, multiple).map(mapValue).filter(Boolean)
//   }
// }

// function resolveValueToObject (
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

//   const mapValue = (val: string) =>
//     items[val] ? { key: val, title: items[val].title } : undefined
//   const splitValue = value.split(',')

//   switch (multiple) {
//     case 1:
//       return mapValue(splitValue[0]) || ''
//     case -1:
//       return splitValue.map(mapValue).filter(Boolean) || []
//     default:
//       return splitValue.slice(0, multiple).map(mapValue).filter(Boolean)
//   }
// }

export { BasicEntityAutocompleteField }
