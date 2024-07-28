import React from 'react'

import {
  TextField,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
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
      options: Open({
        label: { field: Default('label') },
        value: { field: Default('value') },
        multiple: Default(false),
        default: Open({}),
        ents: Open({}),
      }),
      ux: Open({
        kind: Exact('Select'),
        edit: Default(true),
      }),
    }),
  }),
  { name: CMPNAME }
)

function BasicEntitySelectField(props: any) {
  const { spec } = props

  const basicEntitySelectField: Spec = BasicEntitySelectFieldSpecShape(spec)
  const { control, field, getValues } = basicEntitySelectField
  const { resolvedOptions, resolvedDefault } = resolveOptions(field.options)
  const val = getValues(field.name)

  console.log('field', field)
  console.log('val', val)
  console.log('resolvedDefault', resolvedDefault)
  console.log('resolvedOptions', resolvedOptions)

  return (
    <Controller
      key={`${field.id}-controller`}
      name={field.name}
      control={control}
      defaultValue={val || ''}
      render={({ field: { onChange, value } }) => (
        <FormControl fullWidth>
          <InputLabel id={`${field.id}-label`}>{field.label}</InputLabel>
          <Select
            labelId={`${field.id}-label`}
            id={`${field.id}-select`}
            value={resolveValue(field.options, value)}
            multiple={field.options.multiple}
            label={field.name}
            onChange={(event: any) => onChange(event.target.value)}
          >
            {resolvedOptions.map((opt: any) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    />
  )
}

// Returns array of options and default value(s) based on the options object
function resolveOptions(options: any) {
  const { multiple, ents, label, value, default: defaultValues } = options
  const labelField = label?.field
  const valueField = value?.field

  // Array of options
  const resolvedOptions = Object.keys(ents).map((key) => ({
    [labelField]: ents?.[key]?.[labelField],
    [valueField]: key,
  }))

  let resolvedDefault
  if (multiple === false) {
    if (Object.keys(defaultValues).length > 0) {
      const firstKey = Object.keys(defaultValues)[0]
      resolvedDefault = {
        value: firstKey,
        label: defaultValues[firstKey][labelField],
      }
    } else {
      resolvedDefault = null
    }
  } else {
    resolvedDefault = Object.keys(defaultValues).map((key) => ({
      label: defaultValues[key].label,
      value: key,
    }))
  }

  return {
    resolvedOptions,
    resolvedDefault,
  }
}

function resolveValue(options: any, val: any) {
  const { multiple } = options

  if (multiple) {
    if (typeof val === 'string') {
      return val ? [val] : []
    }
    return val || []
  } else {
    return val || ''
  }
}

export { BasicEntitySelectField }
