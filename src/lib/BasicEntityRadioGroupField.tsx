import React, { useEffect, forwardRef } from 'react'

import { FormControlLabel, RadioGroup, Radio, FormLabel } from '@mui/material'
import { Controller } from 'react-hook-form'

import type { Spec } from './basic-types'

import { Default, Exact, Gubu, Skip } from 'gubu'
const CMPNAME = 'BasicEntitySliderField'

const { Open } = Gubu
const BasicEntityRadioGroupFieldSpecShape = Gubu(
  Open({
    field: Open({
      id: String,
      name: String,
      kind: Skip(String),
      label: Default('', String),
      ux: Open({
        kind: Exact('RadioGroup'),
        edit: Default(true),
        direction: Exact('row', 'column').Default('row')
      }),
      options: Open({
        label: { field: Default('label') },
        value: { field: Default('value') },
        default: Open({}),
        ents: Open({})
      })
    })
  }),
  { name: CMPNAME }
)

function BasicEntityRadioGroupField(props: any) {
  const { spec } = props

  const basicEntityRadioGroupField: Spec =
    BasicEntityRadioGroupFieldSpecShape(spec)
  const { control, field } = basicEntityRadioGroupField

  const { resolvedOptions, resolvedDefault } = resolveOptions(field.options)

  return (
    <>
      <FormLabel key={`${field.id}-label`}>{field.label}</FormLabel>
      <Controller
        key={`${field.id}-controller`}
        name={field.name}
        control={control}
        defaultValue={resolvedDefault}
        render={({ field: { onChange, value } }) => (
          <RadioGroup
            key={field.id}
            value={value}
            onChange={onChange}
            row={'row' === field.ux.direction}
          >
            {resolvedOptions.map((option: any) => (
              <FormControlLabel
                key={`${option.value}-option`}
                value={option.value}
                control={<Radio disabled={!field.ux.edit} />}
                label={option.label}
              />
            ))}
          </RadioGroup>
        )}
      />
    </>
  )
}

// Returns array of options and default value(s) based on the options object
function resolveOptions(options: any) {
  const { multiple, ents, label, value, default: defaultValues } = options
  const labelField = label?.field
  const valueField = value?.field

  // Array of options
  const resolvedOptions = Object.keys(ents).map(key => ({
    [labelField]: ents?.[key]?.[labelField],
    [valueField]: key
  }))

  let resolvedDefault
  if (multiple === false) {
    if (Object.keys(defaultValues).length > 0) {
      const firstKey = Object.keys(defaultValues)[0]
      resolvedDefault = {
        value: firstKey,
        label: defaultValues[firstKey][labelField]
      }
    } else {
      resolvedDefault = null
    }
  } else {
    resolvedDefault = Object.keys(defaultValues).map(key => ({
      label: defaultValues[key].label,
      value: key
    }))
  }

  return {
    resolvedOptions,
    resolvedDefault
  }
}

export { BasicEntityRadioGroupField }
