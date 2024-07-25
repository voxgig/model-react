import React, { useEffect, forwardRef } from "react";

import { FormLabel, Slider } from "@mui/material";
import { Controller } from "react-hook-form";

import type { Spec } from './basic-types'

import { Default, Gubu } from 'gubu'
const CMPNAME = 'BasicEntitySliderField'

const { Open } = Gubu
const BasicEntitySliderFieldSpecShape = Gubu(Open({
  field: Open({
    id: String,
    name: String,
    kind: String,
    label: Default('', String),
    ux: Open({
      kind: Default('Text', String),
      edit: Default(true, Boolean),
      step: Default(1, Number),
      min: Default(0, Number),
      max: Default(100, Number)
    })
  }),
  errors: Open({}),
}), {name: CMPNAME})

function BasicEntitySliderField(props: any) {
  const { spec } = props

  const basicEntityAutocompleteField: Spec = BasicEntitySliderFieldSpecShape(spec)
  const { control, field, getValues } = basicEntityAutocompleteField
  const val = getValues(field.name)

//   console.log('BESF', field, val)

    return (
      <>
        <FormLabel id={field.id}>{field.label}</FormLabel>
        <Controller
          name={field.name}
          control={control}
          defaultValue={val || field.ux.min}
          render={({ field: { onChange, value } }) => (
              <Slider 
                  value={value}
                  onChange={(_, newValue) => onChange(newValue)}
                  valueLabelDisplay="auto"
                  step={field.ux.step}
                  marks={resolveMarks(field.ux.marks)}
                  min={field.ux.min}
                  max={field.ux.max}
              />
          )}
        />
      </>
  )
}

function resolveMarks(marks: any) {
  return marks && typeof marks === 'object' 
      ? Object.keys(marks).map(key => ({ label: marks[key], value: +key })) 
      : marks
}


export { BasicEntitySliderField }