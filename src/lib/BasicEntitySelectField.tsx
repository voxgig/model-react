import React from 'react'

import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { Controller } from 'react-hook-form'

import type { Spec } from './basic-types'

import { Default, Exact, Gubu } from 'gubu'
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
  const { control, field, getValues } = basicEntitySelectField
  const { resolvedCategories, resolvedDefault } = resolveCategories(field.cat)
  const val = getValues(field.name)

  // console.log('field', field)
  // console.log('val', val)
  // console.log('resolvedDefault', resolvedDefault)
  // console.log('resolvedCategories', resolvedCategories)

  return (
    <Controller
      key={`${field.id}-controller`}
      name={field.name}
      control={control}
      defaultValue={resolvedDefault}
      render={({ field: { onChange, value } }) => (
        <FormControl fullWidth>
          <InputLabel id={`${field.id}-label`}>{field.label}</InputLabel>
          <Select
            labelId={`${field.id}-label`}
            id={`${field.id}-select`}
            value={resolveValue(value, field.cat)}
            multiple={field.cat.multiple === 1 ? false : true}
            label={field.name}
            onChange={(event: any) => onChange(event.target.value)}
            disabled={!field.ux.edit}
            {...field.ux.props}
          >
            {resolvedCategories.map((opt: any) => (
              <MenuItem key={opt.key} value={opt.key}>
                {opt.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    />
  )
}

// TODO: Make it DRY
// Returns array of options and default value(s) based on the options object
function resolveCategories (cat: any) {
  const { multiple, item: items, default: defaultValues } = cat

  // console.log('resolveCat', 'cat', cat)

  // Array of options
  const resolvedCategories = Object.keys(items).map((key) => ({
    title: items?.[key]?.title,
    key: key,
  }))

  let resolvedDefault: any = multiple === 1 ? null : []
  let defaultList: any[] = []

  if (typeof defaultValues === 'string') {
    defaultList = defaultValues.split(',')
  }

  const mapResolvedDefault = (list: any[]) =>
    list.map((val: any) => ({
      title: items[val].title,
      key: val,
    }))

  if (multiple === 1) {
    resolvedDefault = {
      title: items[defaultList[0]].title,
      key: defaultList[0],
    }
  } else if (multiple === -1) {
    resolvedDefault = mapResolvedDefault(defaultList)
  } else if (multiple > 1) {
    resolvedDefault = mapResolvedDefault(defaultList.slice(0, multiple))
  }

  // console.log('resolveCat', 'resolvedDefault', resolvedDefault)

  return {
    resolvedCategories,
    resolvedDefault,
  }
}

// TODO: Make it DRY
function resolveValue (
  value: any,
  cat: { multiple: number; item: Record<string, { title: string }> }
) {
  const { item: items, multiple } = cat

  if (Array.isArray(value)) {
    return value
  }

  switch (multiple) {
    case 1:
      return { key: value, title: items[value]?.title }
    case -1:
      return value.split(',')
    default:
      if (cat.multiple > 1) {
        return value.split(',').slice(0, multiple)
      }
  }

  return value
}

export { BasicEntitySelectField }
