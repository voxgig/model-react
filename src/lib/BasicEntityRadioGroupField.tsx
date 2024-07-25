import React, { useEffect, forwardRef } from "react";

import { FormControlLabel, RadioGroup, Radio, FormLabel } from "@mui/material";
import { Controller } from "react-hook-form";

import type { Spec } from './basic-types'

import { Default, Exact, Gubu } from 'gubu'
const CMPNAME = 'BasicEntitySliderField'

const { Open } = Gubu
const BasicEntityRadioGroupFieldSpecShape = Gubu(Open({
  field: Open({
    id: String,
    name: String,
    kind: String,
    label: Default('', String),
    ux: Open({
      kind: Exact('RadioGroup'),
      edit: Default(true),
      direction: Exact('row', 'column').Default('row'),
    })
  }),
  errors: Open({}),
}), {name: CMPNAME})

function BasicEntityRadioGroupField(props: any) {
  const { spec } = props;

  const basicEntityRadioGroupField: Spec = BasicEntityRadioGroupFieldSpecShape(spec)
  const { control, field } = basicEntityRadioGroupField
    
  return (
    <>
      <FormLabel key={field.id}>{field.label}</FormLabel>
      <Controller
        key={field.id}
        name={field.name}
        control={control}
        defaultValue={field.default}
        render={({ field: { onChange, value } }) => (
          <RadioGroup key={field.id} value={value} onChange={onChange} row={'row' === field.ux.direction}>
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
