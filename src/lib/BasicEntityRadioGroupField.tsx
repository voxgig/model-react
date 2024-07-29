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
        multiple: Number,
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
            value={resolveValue(value, field.cat)}
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
  cat: {
    multiple: number
    item: Record<string, { title: string }>
  }
) {
  const { item: items, multiple } = cat

  if (Array.isArray(value)) {
    return value
  }

  switch (multiple) {
    case 1:
      return { key: value, title: items[value]?.title }
    case -1:
      return value
        .split(',')
        .map((k: any) => ({ key: k, title: items[k]?.title }))
    default:
      return value
        .split(',')
        .slice(0, multiple)
        .map((k: any) => ({ key: k, title: items[k]?.title }))
  }
}

export { BasicEntityRadioGroupField }
