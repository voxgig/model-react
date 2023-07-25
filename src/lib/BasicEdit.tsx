import { useEffect } from 'react'

import { Grid } from '@mui/material'
import TextField from '@mui/material/TextField'

import { useForm, Controller } from 'react-hook-form'

import BasicButton from './BasicButton'

import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'


const filter = createFilterOptions()

function resolveOptions(options: any) {
}


function BasicEdit(props: any) {
  let {
    item,
    itemFields,
    onClose = () => {},
    onSubmit = () => {},
    children = [],
  } = props
  
  const { ctx, spec } = props
  const { model, seneca, custom } = ctx()
  
  const def = spec.content.def
  const { ent, cols } = def
  
  
  useEffect( () => {
    for(let field of itemFields as any) {
      setValue(field.field, item[field.field] || field.defaultValue || '')
    }
  }, [ item ])
  
  
  const forms = useForm({
    defaultValues: ({ } as any),
  })
  
  const {
    handleSubmit,
    setValue,
    control
  } = forms
  
  return (
    <div className="BasicEdit">
    
      <form
        className="vxg-form-field"
        onSubmit={handleSubmit( async (data: any)=> {
          let selitem = { ...item }
          for(let k in data) {
            selitem[k] = data[k]
          }
          onSubmit(selitem)
        }) }
      >
        <Grid container spacing={3}>
          {
            itemFields.map((field: any, index: any) => {
              // console.log('register: ', item )
                
              return (
                <Grid item xs={field.size} key={index}>
                  <Controller
                    name={field.field}
                    control={control}
                    defaultValue = { item[field.field] || ''}
                    render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                      field.kind === 'combobox' ? 
                        <Autocomplete
                          freeSolo
                          id="combo-box"
                          options={ 'status' === field.type ? Object.keys(field.options) : field.options }
                          fullWidth
                          selectOnFocus
                          onBlur={onBlur}
                          handleHomeEndKeys
                          disableClearable={''==value}
                          disabled={ !!!field.edit }
                          value = { value }
                          getOptionLabel={(option: any) => ( 'status' === field.type ? field.options[option]?.title : option) || option || '' }
      
                          filterOptions={(options: any, params: any) => {
                            const filtered = filter(options, params)
                            const { inputValue } = params
                            // Suggest the creation of a new value
                            const isExisting = options.some((option: any) => inputValue === option)

          
                            if (inputValue != '' && !isExisting) {
        
                              setTimeout(()=>{
                                onChange(inputValue)
                              }, 0)
        
                              return filtered
                            
                            }
                            return filtered
                          }}
      
                          onChange={(event: any, selectedValue: any) => { onChange(selectedValue || '') }}
                          renderInput={(params) => <TextField {...params}
                                                     label={field.headerName}
                                                     onBlur={onBlur}
                                                     error={!!error}
                                                     helperText={error ? error.message : null}  />}
                        />
                        :
                        <TextField
                          key={ field.field }
                          label={ field.headerName }
                          fullWidth
                          disabled={ !!!field.edit }
                          onChange={onChange}
                          value={value}
                          onBlur={onBlur}
                          error={!!error}
                          helperText={error ? error.message : null}
                        /> )
                    }
                    rules={ field.required ? { required: field.required, validate: field.validate || ((value) => true) } : {} }
                  />
                </Grid> )
                
            })
          }
          
          { 
            0 != children.length ?
            <Grid item>
              { children }
            </Grid> : null
          }
          
          <Grid item xs={12}>
            <Grid container justifyContent="space-between" alignItems="center" marginTop={2}>
              <Grid item>
                <BasicButton variant="outlined"
                  size="large"
                  onClick={ () => onClose() }
                >
                  Cancel
                </BasicButton> 
              </Grid>
              <Grid item>
                <BasicButton
                  type="submit"
                  variant="outlined"
                  size="large"
                >
                  SAVE
                </BasicButton>
            
              </Grid>
            </Grid>
          </Grid>
          
        </Grid>
      </form>
        
    </div>)
}

export default BasicEdit
