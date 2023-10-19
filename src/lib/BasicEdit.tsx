import { useEffect } from 'react'

import {
  Grid,
  TextField,
  Autocomplete,
  createFilterOptions,
  MenuItem
} from '@mui/material'

import { useForm, Controller } from 'react-hook-form'

import BasicButton from './BasicButton'

const filter = createFilterOptions()

function resolveOptions (options: any) {
}

function BasicEdit (props: any) {
  const {
    item,
    itemFields,
    onClose = () => {},
    onSubmit = () => {},
    children = []
  } = props

  const { ctx, spec } = props
  const { model, seneca, custom } = ctx()

  const def = spec.content.def
  const { ent, cols } = def

  useEffect(() => {
    for (const field of itemFields) {
      setValue(field.name, item[field.name] || field.defaultValue || '')
    }
  }, [item])

  const forms = useForm({
    defaultValues: ({ } as any)
  })

  const {
    handleSubmit,
    setValue,
    control
  } = forms

  return (
    <div className='BasicEdit'>

      <form
        className='vxg-form-field'
        onSubmit={handleSubmit(async (data: any) => {
          const selitem = { ...item }
          for (const k in data) {
            selitem[k] = data[k]
          }
          onSubmit(selitem)
        })}
      >
        <Grid container spacing={3}>
          {
            itemFields.map((field: any, index: any) => {
              // console.log('register: ', item )
              return (
                <Grid item xs={field.size} key={index}>
                  <Controller
                    name={field.name}
                    control={control}
                    defaultValue={item[field.name] || ''}
                    render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                      field.type === 'selection'
                        ? <Autocomplete
                            freeSolo
                            id='combo-box'
                            options={field.kind}
                            fullWidth
                            selectOnFocus
                            onBlur={onBlur}
                            handleHomeEndKeys
                            disableClearable={value == ''}
                            disabled={!field.edit}
                            value={value}
                            getOptionLabel={(option: any) => option || ''}
                            filterOptions={(options: any, params: any) => {
                              const filtered = filter(options, params)
                              const { inputValue } = params
                              // Suggest the creation of a new value
                              const isExisting = options.some((option: any) => inputValue === option)

                              if (inputValue != '' && !isExisting) {
                                setTimeout(() => {
                                  onChange(inputValue)
                                }, 0)

                                return filtered
                              }
                              return filtered
                            }}

                            onChange={(event: any, selectedValue: any) => { onChange(selectedValue || '') }}
                            renderInput={(params) => <TextField
                              {...params}
                              label={field.headerName}
                              onBlur={onBlur}
                              error={!(error == null)}
                              helperText={(error != null) ? error.message : null}
                                                     />}
                          />
                        : <TextField
                            key={field.name}
                            label={field.headerName}
                            fullWidth
                            select={field.type === 'status'}
                            disabled={!field.edit}
                            onChange={onChange}
                            value={value}
                            onBlur={onBlur}
                            error={!(error == null)}
                            helperText={(error != null) ? error.message : null}
                            sx={{
                              textAlign: 'left'
                            }}
                          >
                          {
                         field.type === 'status'
                           ? Object.keys(field.kind).map((option) =>
                             <MenuItem key={option} value={option}>
                               {field.kind[option]?.title}
                             </MenuItem>
                           )
                           : null
                        }

                        </TextField>
                    )}
                    rules={field.required ? { required: field.required, validate: field.validate || ((value) => true) } : {}}
                  />
                </Grid>
              )
            })
          }

          {
            children.length != 0
              ? <Grid item xs={12}>
                {children}
                </Grid>
              : null
          }

          <Grid item xs={12}>
            <Grid container justifyContent='space-between' alignItems='center' marginTop={2}>
              <Grid item>
                <BasicButton
                  variant='outlined'
                  size='large'
                  onClick={() => onClose()}
                >
                  Cancel
                </BasicButton>
              </Grid>
              <Grid item>
                <BasicButton
                  type='submit'
                  variant='outlined'
                  size='large'
                >
                  SAVE
                </BasicButton>

              </Grid>
            </Grid>
          </Grid>

        </Grid>
      </form>

    </div>
  )
}

export default BasicEdit
