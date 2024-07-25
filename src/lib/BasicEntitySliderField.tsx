import React, { useEffect, forwardRef } from "react";

import { FormLabel, Slider } from "@mui/material";
import { Controller } from "react-hook-form";

import type { Spec } from './basic-types'

import { Default, Exact, Gubu, Skip } from 'gubu'
const CMPNAME = 'BasicEntitySliderField'

const { Open } = Gubu
const BasicEntitySliderFieldSpecShape = Gubu(Open({
  field: Open({
    id: String,
    name: String,
    kind: Skip(String),
    label: Default('', String),
    ux: Open({
      kind: Exact('Slider'),
      edit: Default(true),
      step: Default(1), 
      min: Default(0),
      max: Default(100),
      props: {
        marks: Default({}),
        valueLabelDisplay: Exact('on', 'auto', 'off').Default('auto'),
        direction: Exact('horizontal', 'vertical').Default('horizontal'),
        track: Exact('normal', 'inverted', 'disabled').Default('normal'),
      },
    })
  })
}), {name: CMPNAME})

function BasicEntitySliderField(props: any) {
  const { spec } = props

  const basicEntityAutocompleteField: Spec = BasicEntitySliderFieldSpecShape(spec)
  const { control, field, getValues } = basicEntityAutocompleteField
  const val = getValues(field.name)

//   console.log('BESF', field, val)

    return (
      <>
        <FormLabel key={`${field.id}-label`}>{field.label}</FormLabel>
        <Controller
          key={`${field.id}-controller`}
          name={field.name}
          control={control}
          defaultValue={val || field.ux.min}
          render={({ field: { onChange, value } }) => (
              <Slider 
                  disabled={!field.ux.edit}
                  orientation={field.ux.direction}
                  track={field.ux.track}
                  valueLabelDisplay={field.ux.props.valueLabelDisplay}
                  step={field.ux.step}
                  marks={resolveMarks(field.ux.props.marks)}
                  min={field.ux.min}
                  max={field.ux.max}
                  value={value}
                  onChange={(_, newVal: any) => onChange(newVal)}
              />
          )}
        />
      </>
  )
}

function resolveMarks(marks: any) {
  if (!marks || (typeof marks === 'object' && Object.keys(marks).length === 0)) {
    return false;
  }
  if (typeof marks === 'object') {
    return Object.entries(marks).map(([key, value]) => ({ label: value, value: +key }));
  }

  return marks
}


export { BasicEntitySliderField }