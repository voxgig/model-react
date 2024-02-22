import React, { useEffect } from 'react'

import { useSelector } from 'react-redux'

import { useParams } from 'react-router-dom'


import {
  Box,
  Grid,
  Button,
  Toolbar,
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
    .reduce((a:any,n:any)=>(fixField(n,spec),a.push(n[1]),a),[])

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

        <Grid container spacing={2}>
          { fields.map((field:any)=>
            <Grid
              item
              key={field.id}
              xs={field.ux.size}>

              <BasicEntityField
                ctx={ctx}
                spec={{
                  field,
                  register,
                }} />
            </Grid>
          )}
        </Grid>

        <Toolbar className="vxg-BasicEntityEdit-toolbar-foot">
          <Button type="submit" variant="contained">Save</Button>
        </Toolbar>
      </form>
        : <></> }
    </Box>
  )
}


function fixField(fieldEntry:[string,any], spec:any) {
  const name = fieldEntry[0]
  const field = fieldEntry[1]
  field.id = 'vxg-field-'+spec.name+'-'+name
  field.name = name

  field.ux.size = null == field.ux.size ? 4 : parseInt(field.ux.size,10)
}


export {
  BasicEntityEdit
}
