import React, { useEffect } from 'react'

import {
  TextField
} from '@mui/material'


import type { Spec } from './basic-types'

import { Gubu } from 'gubu'

const CMPNAME = 'BasicEntityField'
console.log(CMPNAME,'2')


const { Open } = Gubu
const BasicEntityFieldSpecShape = Gubu(Open({
  
}), {prefix: CMPNAME})



const fieldMap: any = {
  Text: BasicEntityTextField,
  TextBox: BasicEntityTextBoxField,
}


function BasicEntityField (props: any) {
  const { ctx, spec } = props
  // const { seneca, model } = ctx()

  const basicEntityFieldSpec: Spec = BasicEntityFieldSpecShape(spec)
  console.log(CMPNAME,basicEntityFieldSpec)

  const field: any = basicEntityFieldSpec.field
  // const register = spec.register
  
  console.log(CMPNAME, field)

  const Field: any = fieldMap[field.ux.kind]
  
  return <Field ctx={ctx} spec={spec} />
}



function BasicEntityTextField (props: any) {
  const { spec } = props

  const field = spec.field
  const register = spec.register

  return (
    <div key={field.id}>
      <TextField
        id={field.id}
        name={field.name}
        label={field.title}
        fullWidth
        variant="outlined"
        {...register(field.name)} 
      />
    </div>
  )
}


function BasicEntityTextBoxField (props: any) {
  const { spec } = props

  const field = spec.field
  const register = spec.register

  return (
    <div key={field.name}>
      <TextField
        id={field.id}
        name={field.name}
        label={field.title}
        variant="outlined"
        fullWidth
        multiline
        rows={3}
        {...register(field.name)} 
      />
    </div>
  )
}


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
