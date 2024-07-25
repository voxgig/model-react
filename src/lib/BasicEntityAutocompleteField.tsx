import React, { useEffect, forwardRef } from "react";

import { TextField, Autocomplete } from "@mui/material";
import { Controller } from "react-hook-form";

import type { Spec } from './basic-types'

import { Default, Gubu } from 'gubu'
const CMPNAME = 'BasicEntityAutocompleteField'

const { Open } = Gubu
const BasicEntityAutocompleteFieldSpecShape = Gubu(Open({
  field: Open({
    id: String,
    name: Default('', String),
    label: Default('', String),
    multiple: Default(false, Boolean),
    options: Open({
      default: Open({}),
      label: { field: Default('label', String) },
      multiple: Default(false, Boolean),
      ents: Open({})
    }),
    ux: Open({
      kind: Default('Text', String),
      edit: Default(true, Boolean),
    })
  }),
  errors: Open({}),
}), {name: CMPNAME})

function BasicEntityAutocompleteField(props: any) {
  const { spec } = props

  // console.log('BasicEntityAutocompleteField', spec)

  const basicEntityAutocompleteField: Spec = BasicEntityAutocompleteFieldSpecShape(spec)
  const { control, field } = basicEntityAutocompleteField
  const { resolvedOptions, resolvedDefault } = resolveOptions(field.options);

  return (
      <Controller
        name={field.name}
        control={control}
        defaultValue={resolvedDefault}
        render={({ field: { onChange, value } }) => (
            <Autocomplete
                key={field.id}
                freeSolo
                forcePopupIcon
                multiple={field.options.multiple}
                options={resolvedOptions}
                isOptionEqualToValue={(opt: any, val: any) => 
                  opt === val ||
                  (opt?.id != null && val?.id != null && opt.id === val.id) ||
                  (opt?.value != null && val?.value != null && opt.value === val.value)
                }
                getOptionLabel={(option: any) => option.label}
                value={value}
                onChange={(e: any, val: any) => onChange(val)}
                renderInput={(params: any) => <TextField {...params} label={field.label} />}
            />
        )}
      />
  )
}

function resolveOptions(options: any) {
  const resolvedOptions = Object.keys(options.ents).map(key => ({
    label: options.ents[key].label,
    value: key
  }))

  const resolvedDefault = options.multiple === false ? (
    Object.keys(options.default).length > 0
      ? { value: Object.keys(options.default)[0], label: options.default[Object.keys(options.default)[0]].label }
      : null
  ) : (
    Object.keys(options.default).map(key => ({
      label: options.default[key].label,
      value: key
    }))
  )

  return {
    resolvedOptions,
    resolvedDefault
  }
}

// function resolveDefaultValue(options: any) {
//   if(options.multiple === false) {
//     const keys = Object.keys(options.default);
//     if (keys.length > 0) {
//       return { key: keys[0], value: options.default[keys[0]] }
//     } else {
//       return null
//     } 
//   } else {
//     return Object.keys(options.default).map(key => ({
//       label: options.default[key].label,
//       value: key
//     }))
//   }
// }

// function resolveOptions(options: any) {
//   return Object.keys(options.ents).map(key => ({
//     label: options.ents[key].label,
//     value: key
//   }))
// }

export { BasicEntityAutocompleteField };