import React, { useEffect, useState } from 'react'

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


import { VxgBasicEntityEditPlugin } from './VxgBasicEntityEditPlugin'



const CMPNAME = 'BasicEntityEdit'
console.log(CMPNAME,'1')


const { Open } = Gubu
const BasicEntityEditSpecShape = Gubu(Open({
}), {prefix: CMPNAME})


function BasicEntityEdit (props: any) {
  const { ctx } = props
  const { seneca } = ctx()


  const query = useSelector((state:any)=>state.main.current.view.query)
  
  const [plugin,setPlugin] = useState(false)
  const [ready, setReady] = useState(false)
  
  useEffect(()=>{
    if(!plugin) {
      seneca.use({
        tag: props.spec.name,
        define: VxgBasicEntityEditPlugin,
        options: {
          spec: props.spec,
          setPlugin,
        }
      })
    }
  },[])


  const { spec, slot, fields } =
    seneca.export('VxgBasicEntityEditPlugin/handle') ||
    { spec: {}, slot: null, fields: [] }

  const { ent, name } = spec

  if(plugin && !ready) {
    seneca.act('aim:app,on:BasicLed,ready:edit',{view:name,setReady})
  }

  const slotSelectors = seneca.export('Redux/slotSelectors')
  let { selectItem, selectList, selectMeta } = slotSelectors(slot)

  let item = useSelector((state:any)=>selectItem(state))

  if(item && name) {
    item =
    seneca.direct('aim:app,on:BasicLed,modify:edit', {
      view:name, item, fields
    })
  }

  console.log('EDIT ITEM', item)
  
  const params: any = useParams()

  useEffect(()=>{
    if(ready) {
      if(null == item && null != params.item) {
        seneca.act('aim:app,on:BasicLed,edit:item', {
          view: name,
          fields,
          item_id: params.item
        })
      }
      reset(item)
    }
  },[null==item,ready])

  
  const {
    register,
    handleSubmit,
    getValues,
    reset
  } = useForm({
  })


  
  const onSubmit = (data:any) => {
    // TODO: should be a message
    seneca.make(ent)
      .data$({
        ...data,
        id: item.id,
      slot$: slot,
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
                  getValues,
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



export {
  BasicEntityEdit
}
