import React from 'react'

import { TextField, Autocomplete, Box } from '@mui/material'
import { useController } from 'react-hook-form'

import type { Spec } from './basic-types'

import { Default, Exact, Gubu } from 'gubu'
import { BasicEntityFieldError } from './BasicEntityFieldError'
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

  const basicEntityAutocompleteField: Spec =
    BasicEntityAutocompleteFieldSpecShape(spec)
  const { control, field, errors, getValues, setValue } =
    basicEntityAutocompleteField

  console.log('BERF', 'multiple', field.cat.multiple)

  const defaultAlternative = field.cat.multiple === 1 ? {} : []
  const defaultValues =
    getValues(`${field.name}_default$`) || defaultAlternative
  const categories = getValues(`${field.name}_cat$`) || []

  const err = errors[field.name]

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
      <Autocomplete
        freeSolo
        forcePopupIcon
        multiple={field.cat.multiple !== 1}
        options={categories}
        isOptionEqualToValue={(opt: any, val: any) =>
          opt === val ||
          (opt?.id != null && val?.id != null && opt.id === val.id) ||
          (opt?.key != null && val?.key != null && opt.key === val.key)
        }
        getOptionLabel={(option: any) => option?.title || ''}
        value={controllerField.value}
        disabled={!field.ux.edit}
        onChange={(_, v: any) => {
          console.log('v', v)
          setValue(
            field.name,
            Array.isArray(v) ? v.map((val) => val.key).join(',') : v?.key
          )
          controllerField.onChange(v)
        }}
        renderInput={(params: any) => (
          <TextField {...params} label={field.label} />
        )}
        {...field.ux.props}
      />
      <BasicEntityFieldError err={err} />
    </Box>
  )
}

export { BasicEntityAutocompleteField }
