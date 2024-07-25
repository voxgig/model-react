import React, { useEffect, forwardRef } from "react";

import { FormControlLabel, RadioGroup, Radio, FormLabel } from "@mui/material";
import { Controller } from "react-hook-form";

function BasicEntityRadioGroupField(props: any) {
  const { spec } = props;

  const { field, getValues, control } = spec;
  const val = getValues(field.name);
    
  return (
    <>
      <FormLabel id={field.id}>{field.label}</FormLabel>
      <Controller
        name={field.name}
        control={control}
        defaultValue={field.default}
        render={({ field: { onChange, value } }) => (
          <RadioGroup id={field.id} value={value} onChange={onChange} row={'row' === field.ux?.direction}>
            {field.options.map((option: any) => (
              <FormControlLabel
                key={option.value}
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

export { BasicEntityRadioGroupField };
