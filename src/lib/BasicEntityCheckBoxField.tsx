import React, { useEffect, forwardRef } from "react";

import {
  FormControlLabel,
  Checkbox,
  Box
} from "@mui/material";
import { Controller } from "react-hook-form";

import type { Spec } from './basic-types'

import { Default, Exact, Gubu, One } from 'gubu'
const CMPNAME = 'BasicEntitySliderField'

const { Open } = Gubu
const BasicEntityCheckBoxFieldSpecShape = Gubu(Open({
  field: Open({
    id: String,
    name: String,
    kind: String,
    label: Default('', String),
    ux: Open({
      kind: Exact('CheckBox'),
      edit: Default(true),
      props: Open({}),
    })
  }),
  errors: Open({}),
}), {name: CMPNAME})

function BasicEntityCheckBoxField(props: any) {
  const { spec } = props;

  const basicEntityCheckBoxField: Spec = BasicEntityCheckBoxFieldSpecShape(spec)
  const { control, field, getValues } = basicEntityCheckBoxField
  const val = getValues(field.name)

  console.log('BasicEntityCheckBoxField', field.ux.props)

  return (
    <Box
      key={`${field.id}-box`}
      sx={{ ...field.ux.props }}
    >
      <FormControlLabel
        control={
          <Controller
            key={`${field.id}-controller`}
            name={field.name}
            control={control}
            defaultValue={!!val}
            render={({ field: { onChange, value } }) => (
              <Checkbox
                id={field.id}
                checked={value}
                onChange={onChange}
                disabled={!field.ux.edit}
                required={field.ux.required || false}
              />
            )}
          />
        }
        label={field.label}
      />
    </Box>
  );
}

export { BasicEntityCheckBoxField };