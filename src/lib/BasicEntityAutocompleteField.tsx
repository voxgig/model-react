import React, { useEffect, forwardRef } from 'react'

import { TextField, Autocomplete } from '@mui/material'
import { Controller } from 'react-hook-form'

import type { Spec } from './basic-types'

import { Default, Exact, Gubu, Skip } from 'gubu'
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

  // console.log('BasicEntityAutocompleteField', 'spec', spec)

  const basicEntityAutocompleteField: Spec =
    BasicEntityAutocompleteFieldSpecShape(spec)
  const { control, field } = basicEntityAutocompleteField
  const { resolvedCategories, resolvedDefault } = resolveCategories(field.cat)

  return (
    <Controller
      key={`${field.id}-controller`}
      name={field.name}
      control={control}
      defaultValue={resolvedDefault}
      render={({ field: { onChange, value } }) => (
        <Autocomplete
          freeSolo
          forcePopupIcon
          multiple={field.cat.multiple === 1 ? false : true}
          options={resolvedCategories}
          isOptionEqualToValue={(opt: any, val: any) =>
            opt === val ||
            (opt?.id != null && val?.id != null && opt.id === val.id) ||
            (opt?.key != null && val?.key != null && opt.key === val.key)
          }
          getOptionLabel={(option: any) => option.title}
          value={resolveValue(value, field.cat)}
          disabled={!field.ux.edit}
          {...field.ux.props}
          onChange={(_, newVal: any) => onChange(newVal)}
          renderInput={(params: any) => (
            <TextField {...params} label={field.label} />
          )}
        />
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
  cat: {
    multiple: number
    item: Record<string, { title: string }>
  }
) {
  const { item: items } = cat

  if (Array.isArray(value)) {
    return value
  }

  switch (cat.multiple) {
    case 1:
      return { key: value, title: items[value]?.title }
    case -1:
      return value
        .split(',')
        .map((k: any) => ({ key: k, title: items[k]?.title }))
    default:
      return value
        .split(',')
        .slice(0, cat.multiple)
        .map((k: any) => ({ key: k, title: items[k]?.title }))
  }
}

export { BasicEntityAutocompleteField }
