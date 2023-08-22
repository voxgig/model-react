import { useEffect, useRef } from 'react'

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
      setValue(field.name, item[field.name] || field.defaultValue || '')
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
  
  const formRef = useRef({} as any)
  
  return (
    <div className="BasicEdit">
    
      <form
        ref={ formRef }
        className="vxg-form-field"
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
                    defaultValue = { item[field.name] || ''}
                    render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                      'selection' === field.type ? 
                        <Autocomplete
                          freeSolo
                          id="combo-box"
                          options={ field.kind }
                          fullWidth
                          selectOnFocus
                          onBlur={onBlur}
                          handleHomeEndKeys
                          disableClearable={''==value}
                          disabled={ !!!field.edit }
                          value = { value }
                          getOptionLabel={(option: any) => option || '' }
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
                          renderInput={(params) => <TextField
                                                     {...params} 
                                                     label={field.headerName}
                                                     onBlur={onBlur}
                                                     error={!!error}
                                                     helperText={error ? error.message : null}
                                                     />
                                                    }
                        />
                        :
                        <TextField
                          key={ field.name }
                          label={ field.headerName }
                          fullWidth
                          select = { 'status' === field.type }
                          disabled={ !!!field.edit }
                          onChange={onChange}
                          value={ value }
                          onBlur={onBlur}
                          error={!!error}
                          helperText={error ? error.message : null}
                          sx = { {
                            textAlign: 'left',
                          } }
                        >	
                        {
                         'status' === field.type ?
                           Object.keys(field.kind).map((option)=>
                             <MenuItem key={option} value={option} >
                               { field.kind[option]?.title }
                             </MenuItem>
                           )
                         :
                           null
                        }
                        
                        </TextField>
                       )
                    }
                    rules={ field.required ? { required: field.required, validate: field.validate || ((value) => true) } : {} }
                  />
                </Grid> )
                
            })
          }
          
          
        </Grid>
        
      </form>
      { 
        0 != children.length ?
          <Grid item xs={12}>
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
              variant="outlined"
              size="large"
              onClick={handleSubmit( async (data: any)=> {
                let selitem = { ...item }
                for(let k in data) {
                  selitem[k] = data[k]
                }
                onSubmit(selitem)
              }) }
            >
              SAVE
            </BasicButton>
            
          </Grid>
        </Grid>
      </Grid>
         
    </div>)
}

export default BasicEdit
