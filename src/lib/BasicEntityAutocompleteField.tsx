import React, { useEffect, forwardRef } from "react";

import { FormControlLabel, Checkbox, Box, RadioGroup, Radio, FormLabel, TextField, Autocomplete } from "@mui/material";
import { Controller } from "react-hook-form";



function BasicEntityAutocompleteField(props: any) {
  const { spec } = props

  const { field, getValues, control } = spec
  const val = getValues(field.name)

  return (
      <Controller
        name={field.name}
        control={control}
        defaultValue={resolveOptions(field.options.default)}
        render={({ field: { onChange, value } }) => (
            <Autocomplete
                key={field.id}
                freeSolo
                forcePopupIcon
                multiple={field.ux.multiple}
                options={resolveOptions(field.options.ents)}
                isOptionEqualToValue={(option: any, value: any) => option.value === value.value}
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
  return Object.keys(options).map(key => ({
    label: options[key].label,
    value: key
  }));
}

export { BasicEntityAutocompleteField };