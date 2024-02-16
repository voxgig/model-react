import React, { useEffect } from 'react'

import { useSelector } from 'react-redux'

import { useParams } from 'react-router-dom'


import {
  Grid,
  TextField,
  Autocomplete,
  createFilterOptions,
  MenuItem,
  Box
} from '@mui/material'

import { useForm, Controller } from 'react-hook-form'

// import BasicButton from './BasicButton'

// const filter = createFilterOptions()


const CMPNAME = 'BasicEdit'
console.log(CMPNAME,'1')


function BasicEdit (props: any) {
  const { ctx, spec } = props
  const { seneca, model } = ctx()

  const name = spec.name
  const slotName = spec.prefix+spec.name
  const canon = spec.ent
  
  const slotSelectors = seneca.export('Redux/slotSelectors')
  let { selectItem, selectList, selectMeta } = slotSelectors(slotName)

  let item = useSelector((state:any)=>selectItem(state))

  const params: any = useParams()

  console.log(CMPNAME, 'params', params, item)

  useEffect(()=>{
    if(null == item) {
      seneca.act('aim:app,on:view,edit:item', {
        view: name,
        item_id: params.item
      })
    }
  },[])
  
  return (
    <Box className='vxg-BasicEdit'>
      <p>ITEM: {slotName} { JSON.stringify(item) }</p>
    </Box>
  )

  
  /*
  const {
    item,
    itemFields,
    onClose = () => {},
    onSubmit = () => {},
    children = []
  } = props

  useEffect(() => {
    for (const [key, field] of Object.entries<any>(itemFields)) {
      setValue(field.name, item[field.name] || field.defaultValue || '')
    }
  }, [item])

  const forms = useForm({
    defaultValues: {} as any
  })

  const { handleSubmit, setValue, control } = forms

  return (
    <Box className='BasicEdit'>
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
          {Object.entries(itemFields).map(([index, field]: [any, any]) => {
            return (
              <Grid item xs={field.size} key={index}>
                <Controller
                  name={index}
                  control={control}
                  defaultValue={item[index] || ''}
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error }
                  }) =>
                    field.type === 'selection' ? (
                      <Autocomplete
                        freeSolo
                        id='combo-box'
                        options={field.options}
                        fullWidth
                        selectOnFocus
                        onBlur={onBlur}
                        handleHomeEndKeys
                        disableClearable={value == ''}
                        disabled={!field.editable}
                        value={value}
                        getOptionLabel={(option: any) => option || ''}
                        filterOptions={(options: any, params: any) => {
                          const filtered = filter(options, params)
                          const { inputValue } = params
                          // Suggest the creation of a new value
                          const isExisting = options.some(
                            (option: any) => inputValue === option
                          )

                          if (inputValue != '' && !isExisting) {
                            setTimeout(() => {
                              onChange(inputValue)
                            }, 0)

                            return filtered
                          }
                          return filtered
                        }}
                        onChange={(event: any, selectedValue: any) => {
                          onChange(selectedValue || '')
                        }}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label={field.label}
                            onBlur={onBlur}
                            error={!(error == null)}
                            helperText={error != null ? error.message : null}
                          />
                        )}
                      />
                    ) : (
                      <TextField
                        key={index}
                        label={field.label}
                        fullWidth
                        select={field.inputType === 'select'}
                        disabled={!field.editable}
                        onChange={onChange}
                        value={value}
                        onBlur={onBlur}
                        error={!(error == null)}
                        helperText={error != null ? error.message : null}
                        sx={{
                          textAlign: 'left'
                        }}
                      >
                        {field.inputType === 'select'
                          ? Object.keys(field.options).map(option => (
                              <MenuItem key={option} value={option}>
                                {field.options[option]?.label}
                              </MenuItem>
                            ))
                          : null}
                      </TextField>
                    )
                  }
                  rules={
                    field.required
                      ? {
                          required: field.required,
                          validate: field.validate || (value => true)
                        }
                      : {}
                  }
                />
              </Grid>
            )
          })}

          {children.length != 0 ? (
            <Grid item xs={12}>
              {children}
            </Grid>
          ) : null}

          <Grid item xs={12}>
            <Grid
              container
              justifyContent='space-between'
              alignItems='center'
              marginTop={2}
            >
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
                <BasicButton type='submit' variant='outlined' size='large'>
                  SAVE
                </BasicButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
  */
}

export {
  BasicEdit
}
