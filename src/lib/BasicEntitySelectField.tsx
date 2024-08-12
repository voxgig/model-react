import React from 'react'

import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material'
import { useController } from 'react-hook-form'

import type { Spec } from './basic-types'

import { Default, Exact, Gubu } from 'gubu'
import { BasicEntityFieldError } from './BasicEntityFieldError'
const CMPNAME = 'BasicEntitySelectField'

const { Open } = Gubu
const BasicEntitySelectFieldSpecShape = Gubu(
  Open({
    field: Open({
      id: String,
      name: String,
      kind: '',
      label: '',
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
      ux: Open({
        kind: Exact('Select'),
        edit: Default(true),
      }),
    }),
  }),
  { name: CMPNAME }
)

function BasicEntitySelectField (props: any) {
  const { spec } = props

  const basicEntitySelectField: Spec = BasicEntitySelectFieldSpecShape(spec)
  const { control, field, errors, getValues, setValue } = basicEntitySelectField
  const err = errors[field.name]

  const defaultValues =
    getValues(field.name + '_default$') || (field.cat.multiple === 1 ? '' : [])
  const categories = getValues(field.name + '_cat$') || []

  const {
    field: controllerField,
    fieldState: { error },
  } = useController({
    name: field.name + '_uival$',
    control,
    defaultValue: defaultValues,
  })

  return (
    <Box key={`${field.id}-box`}>
      <FormControl fullWidth>
        <InputLabel id={`${field.id}-label`}>{field.label}</InputLabel>
        <Select
          labelId={`${field.id}-label`}
          id={`${field.id}-select`}
          value={controllerField.value}
          multiple={field.cat.multiple !== 1}
          label={field.name}
          onChange={(event: any) => {
            // TODO: consider moving it to a msg
            const { value } = event.target
            setValue(field.name, Array.isArray(value) ? value.join(',') : value)
            controllerField.onChange(value)
          }}
          disabled={!field.ux.edit}
          {...field.ux.props}
        >
          {categories.map((opt: any) => (
            <MenuItem key={opt.key} value={opt.key}>
              {opt.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <BasicEntityFieldError err={err} />
    </Box>
  )
}

export { BasicEntitySelectField }
