import React, { useEffect, forwardRef } from 'react'

import {
  TextField,
  FormControl,
  FormLabel,
} from '@mui/material'


import type { Spec } from './basic-types'

import { Gubu } from 'gubu'

const CMPNAME = 'BasicEntityField'
console.log(CMPNAME,'3')


const { Open } = Gubu
const BasicEntityFieldSpecShape = Gubu(Open({
  
}), {name: CMPNAME})



const fieldMap: any = {
  Text: BasicEntityTextField,
  TextBox: BasicEntityTextBoxField,
  Date: BasicEntityDateField,
  DateTime: BasicEntityDateTimeField,
  Time: BasicEntityTimeField,
}


function BasicEntityField (props: any) {
  const { ctx, spec } = props
  // const { seneca, model } = ctx()

  const basicEntityFieldSpec: Spec = BasicEntityFieldSpecShape(spec)
  // console.log(CMPNAME,basicEntityFieldSpec)

  const field: any = basicEntityFieldSpec.field
  // const register = spec.register
  
  // console.log(CMPNAME, field)

  const Field: any = fieldMap[field.ux.kind]
  
  return <Field ctx={ctx} spec={spec} />
}



function BasicEntityTextField (props: any) {
  const { spec } = props

  const { field, register, getValues } = spec

  const val = getValues(field.name)
  
  return (
    <div key={field.id}>
      <TextField
        id={field.id}
        name={field.name}
        label={field.label}
        fullWidth
        variant="outlined"
        InputLabelProps={{ shrink: val?.length > 0 }}
        {...register(field.name)} 
      />
    </div>
  )
}


function BasicEntityTextBoxField (props: any) {
  const { spec } = props

  const { field, register, getValues } = spec

  const val = getValues(field.name)
  
  return (
    <div key={field.name}>
      <TextField
        id={field.id}
        name={field.name}
        label={field.label}
        variant="outlined"
        fullWidth
        multiline
        rows={3}
                InputLabelProps={{ shrink: val?.length > 0 }}
        {...register(field.name)} 
      />
    </div>
  )
}


function BasicEntityDateField (props: any) {
  const { spec } = props

  const { field, register, getValues } = spec

  const val = getValues(field.name)

  return (
    <div key={field.id}>
      <TextField
        id={field.id}
        name={field.name}
        label={field.label}
        fullWidth
        variant="outlined"
        type="date"
        disabled={!field.ux.edit}
        InputLabelProps={{ shrink: val?.length > 0 }}
        {...register(field.name)} 
      />
    </div>
  )
}


function BasicEntityTimeField (props: any) {
  const { spec } = props

  const { field, register, getValues } = spec

  const val = getValues(field.name)

  return (
    <div key={field.id}>
      <TextField
        id={field.id}
        name={field.name}
        label={field.label}
        fullWidth
        variant="outlined"
        type="time"
        disabled={!field.ux.edit}
        InputLabelProps={{ shrink: val?.length > 0 }}
        {...register(field.name)} 
      />
    </div>
  )
}


function BasicEntityDateTimeField (props: any) {
  const { spec } = props

  const { field, register, getValues } = spec

  const val = getValues(field.name)

  return (
    <div key={field.id}>
      <TextField
        id={field.id}
        name={field.name}
        label={field.label}
        fullWidth
        variant="outlined"
        type="datetime-local"
        disabled={!field.ux.edit}
        InputLabelProps={{ shrink: val?.length > 0 }}
        {...register(field.name)} 
      />
    </div>
  )
}



/*
function BasicEntityDateTimeField (props: any) {
  const { spec } = props

  const field = spec.field
  const register = spec.register

  return (
    <TextField
      id={field.id}
      name={field.name}
      label={field.label}
      fullWidth
      variant="outlined"
      disabled={!field.ux.edit}
      value=" "
      InputProps={{
        inputComponent: forwardRef(()=>
          <div
            className="MuiInputBase-input MuiOutlinedInput-input"
            style={{padding:'16px'}}
          >
        <input
          id={field.id+'_date$'}
          name={field.name+'_date$'}
          type="date"
          disabled={!field.ux.edit}
          {...register(field.name+'_date$')}
        />
        <input
          id={field.id+'_time$'}
          name={field.name+'_time$'}
          type="time"
          disabled={!field.ux.edit}
          {...register(field.name+'_time$')} 
        />
      </div>
        ),
      }}
    />
  )
}
*/




/* Notes

https://www.react-hook-form.com/
https://seanconnolly.dev/react-hook-form-material-ui
https://www.bugpilot.com/guides/en/using-material-ui-react-hook-form-cf8e
https://blog.logrocket.com/using-material-ui-with-react-hook-form/

https://mui.com/material-ui/react-grid/

 */



export {
  BasicEntityField
}
