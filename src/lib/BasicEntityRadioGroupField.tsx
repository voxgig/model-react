import React, { useEffect, forwardRef } from 'react'

import { FormControlLabel, RadioGroup, Radio, FormLabel } from '@mui/material'
import { Controller } from 'react-hook-form'

import type { Spec } from './basic-types'

import { Default, Exact, Gubu, Skip } from 'gubu'
import { resolve } from 'path'
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
  const { control, field } = basicEntityRadioGroupField

  const { resolvedCategories, resolvedDefault } = resolveCategories(field.cat)

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
            disabled={!field.ux.edit}
            {...field.ux.props}
          >
            {resolvedCategories.map((option: any) => (
              <FormControlLabel
                key={`${option.key}-option`}
                value={option.key}
                control={<Radio disabled={!field.ux.edit} />}
                label={option.title}
              />
            ))}
          </RadioGroup>
        )}
      />
    </>
  )
}

// Returns array of options and default value(s) based on the options object
function resolveCategories (cat: any) {
  const { item: items, default: defaultValues } = cat

  // Array of options
  const resolvedCategories = Object.keys(items).map((key) => ({
    title: items?.[key]?.title,
    key: key,
  }))

  const resolvedDefault = defaultValues

  return {
    resolvedCategories,
    resolvedDefault,
  }
}

export { BasicEntityRadioGroupField }
