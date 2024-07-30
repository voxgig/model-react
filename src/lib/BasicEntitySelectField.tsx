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
  const { control, field } = basicEntitySelectField

  return (
    <Controller
      key={`${field.id}-controller`}
      name={field.name}
      control={control}
      defaultValue={resolveDefault(field.cat)}
      render={({ field: { onChange, value } }) => (
        <FormControl fullWidth>
          <InputLabel id={`${field.id}-label`}>{field.label}</InputLabel>
          <Select
            labelId={`${field.id}-label`}
            id={`${field.id}-select`}
            value={resolveValue(value, field.cat)}
            multiple={field.cat.multiple !== 1}
            label={field.name}
            onChange={(event: any) => onChange(event.target.value)}
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
      )}
    />
  )
}

// Returns array of options based on field.cat object
function resolveCategories (cat: any) {
  return Object.keys(cat.item).map((key) => ({
    title: cat.item?.[key]?.title,
    key: key,
  }))
}

function resolveDefault (cat: any) {
  const { multiple, default: defaultValues } = cat

  if (!defaultValues) {
    return multiple === 1 ? '' : ['']
  }

  const defaultItems = defaultValues.split(',')

  const mapResolvedDefault = (list: string[]) => list.map((val) => val)

  switch (multiple) {
    case 1:
      return defaultItems.length > 0 ? defaultItems[0] : ''
    case -1:
      return mapResolvedDefault(defaultItems)
    default:
      return mapResolvedDefault(defaultItems.slice(0, multiple))
  }
}

// TODO: Make it DRY
function resolveValue (
  value: any,
  cat: { multiple: number; item: Record<string, { title: string }> }
) {
  const { multiple } = cat

  if (Array.isArray(value)) {
    const items = value.map((val) => val.key)
    return multiple === 1 ? items[0] : items.slice(0, multiple)
  }

  if (typeof value === 'object' && value !== null) {
    return multiple === 1 ? value.key : [value.key]
  }

  let items = value.split(',')
  switch (multiple) {
    case 1:
      return items[0] || ''
    case -1:
      return items
    default:
      return items.slice(0, multiple)
  }
}

export { BasicEntitySelectField }
