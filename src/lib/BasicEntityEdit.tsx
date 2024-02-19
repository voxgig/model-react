import React, { useEffect } from 'react'

import { useSelector } from 'react-redux'

import { useParams } from 'react-router-dom'


import {
  Box
} from '@mui/material'

import { useForm } from 'react-hook-form'


import type { Spec } from './basic-types'

import { Gubu } from 'gubu'

import { BasicEntityField } from './BasicEntityField'



const CMPNAME = 'BasicEntityEdit'
console.log(CMPNAME,'1')


const { Open } = Gubu
const BasicEntityEditSpecShape = Gubu(Open({
}), {prefix: CMPNAME})


function BasicEntityEdit (props: any) {
  const { ctx, spec } = props
  const { seneca, model } = ctx()

  const basicEntityEditSpec: Spec = BasicEntityEditSpecShape(spec)
  console.log(CMPNAME,basicEntityEditSpec)

  const name = spec.name
  const slotName = spec.prefix+spec.name
  const canon = spec.ent
  const fields = Object.entries(spec.field)
  .reduce((a:any,n:any)=>(n[1].name=n[0],a.push(n[1]),a),[])

  const slotSelectors = seneca.export('Redux/slotSelectors')
  let { selectItem, selectList, selectMeta } = slotSelectors(slotName)

  let item = useSelector((state:any)=>selectItem(state))

  const params: any = useParams()

  console.log(CMPNAME, 'params', params, item, fields)

  useEffect(()=>{
    if(null == item && null != params.item) {
      seneca.act('aim:app,on:view,edit:item', {
        view: name,
        item_id: params.item
      })
    }
    reset(item)
  },[item])


  const {
    register,
    handleSubmit,
    reset
  } = useForm({
  })


  
  const onSubmit = (data:any) => {
    console.log('handleSubmit', data)
    seneca.make(canon)
      .data$({
        ...data,
        id: item.id,
      slot$: slotName,
    })
    .save$()
  }
  
  return (
    <Box className='vxg-BasicEntityEdit'>
      { item ?
      <form
        className='vxg-BasicEntityEdit-form'
        onSubmit={handleSubmit(onSubmit)}
      >

        { fields.map((field:any)=>
          <BasicEntityField ctx={ctx} spec={{
            field,
            register,
          }} />
        )}
        
        <input type="submit" />
        <br />
      </form>
        : <></> }
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
    <Box className='BasicEntityEdit'>
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
  BasicEntityEdit
}
