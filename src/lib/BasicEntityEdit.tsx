import React, { useEffect, useState, useCallback } from 'react'

import { useSelector } from 'react-redux'

import { useParams } from 'react-router-dom'


import {
  Box,
  Grid,
  Button,
  Toolbar,
} from '@mui/material'

import { useForm } from 'react-hook-form'


import { BasicEntityField } from './BasicEntityField'


import { VxgBasicEntityEditPlugin } from './VxgBasicEntityEditPlugin'


const CMPNAME = 'BasicEntityEdit'


// TODO: make this debuggable
// Resolver for react-hook-form
const makeResolver = (seneca:any, spec:any) => useCallback(async (data:any) => {
  const { ent, name } = spec
  
  const view = name
  let entity = seneca.entity(ent)
  
  entity = entity.make$().data$(data)
  let errors = entity.valid$({errors:true})

  // Emit a seneca message to provide errors for other uses - debugging etc.
  // To listen for these, use seneca.sub('aim:app,on:BasicLed,entity:valid,view:VIEW', listener)
  // Also useful for introspecting the error details for gubu-errmsg patterns
  seneca.act('aim:app,on:BasicLed,entity:valid',{
    view,
    entity,
    errors,
  })
  
  // TODO: need a better way to access this; also namespaced!
  // NOTE: uses gubu-errmsg
  const errmsg = seneca.context.errmsg

  // Convert to react-hook-form errors
  errors = errors
    .map((e:any)=>(e.tag_kind='ent',e))
    .reduce((a:any,e:any,_:any)=>(a[e.key]={
      type: e.type,
      message: errmsg ? ((_=errmsg.find(e))?_.text:e.text) : e.text
    },a),{})

  const values = entity.data$(false)
  const out = {
    values,
    errors,
  }

  return out
},[spec.ent])


function BasicEntityEdit (props: any) {
  const { ctx } = props
  const { seneca } = ctx()

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

  const resolver = makeResolver(seneca, spec)

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver,
  })

  const onSubmit = (data:any) => {
    seneca.act('aim:app,on:BasicLed,save:item',{view:name,data})
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
                  errors,
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
