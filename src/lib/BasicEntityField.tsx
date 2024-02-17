import React, { useEffect } from 'react'



import type { Spec } from './basic-types'

import { Gubu } from 'gubu'

const CMPNAME = 'BasicEntityField'
console.log(CMPNAME,'1')


const { Open } = Gubu
const BasicEntityFieldSpecShape = Gubu(Open({
}), {prefix: CMPNAME})


function BasicEntityField (props: any) {
  const { ctx, spec } = props
  const { seneca, model } = ctx()

  const basicEntityFieldSpec: Spec = BasicEntityFieldSpecShape(spec)
  console.log(CMPNAME,basicEntityFieldSpec)

  const field = spec.field
  const register = spec.register

  console.log(CMPNAME, field)

  
  return (
    <div key={field.name}>
      <label>{field.title}</label>
      <input {...register(field.name)} />
    </div>
  )
}

export {
  BasicEntityField
}
