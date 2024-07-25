import React, { useEffect, forwardRef } from "react";

import { TextField, Autocomplete } from "@mui/material";
import { Controller } from "react-hook-form";

import type { Spec } from './basic-types'

import { Default, Exact, Gubu, Skip } from 'gubu'
const CMPNAME = 'BasicEntityAutocompleteField'

const { Open } = Gubu
const BasicEntityAutocompleteFieldSpecShape = Gubu(Open({
  field: Open({
    id: String,
    name: String,
    kind: Skip(String),
    label: Default(''),
    options: Open({
      label: { field: Default('label') },
      value: { field: Default('value') },
      multiple: Default(false),
      default: Open({}),
      ents: Open({})
    }),
    ux: Open({
      kind: Exact('Autocomplete'),
      edit: Default(true),
    })
  })
}), {name: CMPNAME})

function BasicEntityAutocompleteField(props: any) {
  const { spec } = props

  const basicEntityAutocompleteField: Spec = BasicEntityAutocompleteFieldSpecShape(spec)
  const { control, field } = basicEntityAutocompleteField
  const { resolvedOptions, resolvedDefault } = resolveOptions(field.options);

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
                multiple={field.options.multiple}
                options={resolvedOptions}
                isOptionEqualToValue={(opt: any, val: any) => 
                  opt === val ||
                  (opt?.id != null && val?.id != null && opt.id === val.id) ||
                  (opt?.value != null && val?.value != null && opt.value === val.value)
                }
                getOptionLabel={(option: any) => option[field.options.label.field]}
                value={resolveValue(field.options, value)}
                onChange={(_, newVal: any) => onChange(newVal)}
                renderInput={(params: any) => <TextField {...params} label={field.label} />}
            />
        )}
      />
  )
}

// Returns array of options and default value(s) based on the options object
function resolveOptions(options: any) {
  const { multiple, ents, label, value, default: defaultValues } = options;
  const labelField = label?.field;
  const valueField = value?.field; 

  // Array of options
  const resolvedOptions = Object.keys(ents).map(key => ({
    [labelField]: ents?.[key]?.[labelField],
    [valueField]: key
  }));

  let resolvedDefault;
  if (multiple === false) {
    if (Object.keys(defaultValues).length > 0) {
      const firstKey = Object.keys(defaultValues)[0];
      resolvedDefault = { value: firstKey, label: defaultValues[firstKey][labelField] };
    } else {
      resolvedDefault = null;
    }
  } else {
    resolvedDefault = Object.keys(defaultValues).map(key => ({
      label: defaultValues[key].label,
      value: key
    }));
  }

  return {
    resolvedOptions,
    resolvedDefault
  };
}

function resolveValue(options: any, val: any) {
  const { multiple, ents, label, value } = options;
  const labelField = label?.field;
  const valueField = value?.field;

  const getValue = (val: string) => ents?.[val]?.[labelField] ? { [valueField]: val, [labelField]: ents[val][labelField] || val } : undefined;

  if (!multiple) {
    return typeof val === 'string' ? getValue(val) : (val || undefined);
  } else {
    if (typeof val === 'string') {
      const resolvedValue = getValue(val);
      return resolvedValue ? [resolvedValue] : [];
    }
    return val || [];
  }
}

export { BasicEntityAutocompleteField }