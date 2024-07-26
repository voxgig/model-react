import React, { useEffect, useState, useCallback } from 'react'

import { useSelector } from 'react-redux'

import { useParams } from 'react-router-dom'

import { Box, Grid, Button, Toolbar } from '@mui/material'

import { useForm } from 'react-hook-form'

import { BasicEntityField } from './BasicEntityField'

import { VxgBasicEntityEditPlugin } from './VxgBasicEntityEditPlugin'

const CMPNAME = 'BasicEntityEdit'

// TODO: make this debuggable
const makeResolver = (entity: any) =>
  useCallback(
    async (data: any) => {
      // const shape = entity.valid$({shape:true})
      entity = entity.make$().data$(data)
      let errors = entity.valid$({ errors: true })

      // TODO: use a seneca sub message to provide errors for other uses - debugging etc.

      // TODO: need a better way to access this; also namespaced!
      const errmsg = entity.private$.get_instance().context.errmsg
      console.log('ERRORS', errors, 'ERRMSG', errmsg.print())

      errors = errors
        .map((e: any) => ((e.tag_kind = 'ent'), e))
        .reduce(
          (a: any, e: any, _: any) => (
            (a[e.key] = {
              type: e.type,
              message: errmsg
                ? (_ = errmsg.find(e))
                  ? _.text
                  : e.text
                : e.text,
            }),
            a
          ),
          {}
        )

      const values = entity.data$(false)
      const out = {
        values,
        errors,
      }

      console.log('ERROUT', out)

      return out
    },
    [entity.entity$]
  )

function BasicEntityEdit(props: any) {
  const { ctx } = props
  const { seneca } = ctx()

  // const query = useSelector((state:any)=>state.main.current.view.query)

  const [plugin, setPlugin] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!plugin) {
      seneca.use({
        tag: props.spec.name,
        define: VxgBasicEntityEditPlugin,
        options: {
          spec: props.spec,
          setPlugin,
        },
      })
    }
  }, [])

  const { spec, slot, fields } = seneca.export(
    'VxgBasicEntityEditPlugin/handle'
  ) || { spec: {}, slot: null, fields: [] }

  const { ent, name } = spec

  if (plugin && !ready) {
    seneca.act('aim:app,on:BasicLed,ready:edit', { view: name, setReady })
  }

  const slotSelectors = seneca.export('Redux/slotSelectors')
  let { selectItem, selectList, selectMeta } = slotSelectors(slot)

  let item = useSelector((state: any) => selectItem(state))

  if (item && name) {
    item = seneca.direct('aim:app,on:BasicLed,modify:edit', {
      view: name,
      item,
      fields,
    })
  }

  const params: any = useParams()

  useEffect(() => {
    if (ready) {
      if (null == item && null != params.item) {
        seneca.act('aim:app,on:BasicLed,edit:item', {
          view: name,
          fields,
          item_id: params.item,
        })
      }
      reset(item)
    }
  }, [null == item, ready])

  const resolver = makeResolver(seneca.entity(ent))

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    control,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver,
  })

  const onSubmit = (data: any) => {
    seneca.act('aim:app,on:BasicLed,save:item', { view: name, data })
  }

  return (
    <Box className="vxg-BasicEntityEdit">
      {item ? (
        <form
          className="vxg-BasicEntityEdit-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Grid container spacing={2}>
            {fields.map((field: any) => (
              <Grid item key={field.id} xs={field.ux.size}>
                <BasicEntityField
                  ctx={ctx}
                  spec={{
                    field,
                    register,
                    getValues,
                    control,
                    errors,
                  }}
                />
              </Grid>
            ))}
          </Grid>

          {/* <p>errors: {JSON.stringify(errors)}</p> */}

          <Toolbar className="vxg-BasicEntityEdit-toolbar-foot">
            <Button type="submit" variant="contained">
              Save
            </Button>
          </Toolbar>
        </form>
      ) : (
        <></>
      )}
    </Box>
  )
}

export { BasicEntityEdit }
