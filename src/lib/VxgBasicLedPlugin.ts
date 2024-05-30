
import type { Spec } from './basic-types'

import { Gubu } from 'gubu'

const { Open } = Gubu

const Shape = Gubu({
  name: String,
  title: String,
  active: Boolean,
  kind: String,
  def: {
    ent: String,
    head: Open({
      active: false,
    }),
    list: Open({
      active: false,
    }),
    edit: Open({
      active: false,
    }),
    foot: Open({
      active: false,
    }),
  },
}, { prefix: 'BasicLed' })


function VxgBasicLedPlugin(this: any, options: any) {
  const seneca = this

  const spec = Shape(options.spec)
  const navigate = options.navigate

  const name = spec.name
  const entCanon = spec.def.ent
  const slotName = 'BasicLed_' + name

  seneca
    .fix({ view: name })

    .add('aim:app,on:view,init:state,redux$:true',
      function(this: any, _msg: any, reply: any, meta: any) {
        const state = meta.custom.state()
        let view = state.view[name]
        view.mode = 'list'
        view.status = 'init'
        view.ready = true

        this.export('Redux/entityPrepare')(state, slotName)
        reply()
      })

    .add('aim:app,on:BasicLed,ready:list,redux$:true',
      function(msg: any, reply: any, meta: any) {
        const setReady = msg.setReady
        const view = meta.custom.state().view[name]

        view.mode = 'list'
        view.status = 'list-item'

        setReady(true)
        reply()
      })

    .add('aim:app,on:BasicLed,ready:edit,redux$:true',
      function(msg: any, reply: any, meta: any) {
        const setReady = msg.setReady
        const view = meta.custom.state().view[name]

        view.mode = 'edit'
        view.status = 'edit-item'

        setReady(true)
        reply()
      })

    .add('aim:app,on:BasicLed,modify:edit',
      function(msg: any) {
        let item = msg.item
        let fields = msg.fields

        if (null == item) return item;

        item = { ...item }

        for (const field of fields) {
          if ('Date' === field.ux.kind) {
            item[field.name + '_orig$'] = item[field.name]
            item[field.name] = new Date(item[field.name]).toISOString().split('T')[0]
            item[field.name + '_time$'] =
              item[field.name + '_orig$'] - new Date(item[field.name]).getTime()
          }
          else if ('Time' === field.ux.kind) {
            const tstr = new Date(item[field.name]).toISOString().split('T')[1]
            item[field.name + '_orig$'] = item[field.name]
            item[field.name] = tstr.split('.')[0]
            item[field.name + '_millis$'] = tstr.split('.')[1]
          }
          else if ('DateTime' === field.ux.kind) {
            const iso = new Date(item[field.name]).toISOString()
            const dstr = iso.split('T')[0]
            const tstr = iso.split('T')[1].split('.')[0]
            item[field.name] = dstr + 'T' + tstr
            item[field.name + '_date$'] = dstr
            item[field.name + '_time$'] = tstr
            item[field.name + '_millis$'] = tstr.split('.')[1]
          }
        }

        return item
      })

    .message('aim:app,on:BasicLed,edit:item,redux$:true',
      { item_id: String },
      async function(this: any, msg: any, meta: any) {
        const state = meta.custom.state()
        let view = state.view[name]
        const { item_id } = msg
        view.mode = 'edit'
        navigate('/view/' + name + '/edit/' + item_id)

        const item = await this.entity(entCanon).load$({
          id: msg.item_id,
          slot$: slotName,
        })

        return item
      })

    .message('aim:app,on:view,add:item',
      async function(this: any, _msg: any) {
        await seneca.entity(entCanon).save$({ add$: true, slot$: slotName })
        navigate('/view/' + name + '/add')
      })

  seneca
    .prepare(async function(this: any) {
      this.act('aim:app,on:view,init:state,direct$:true', { view: name })
    })


  const sharedSpec = {
    name,
    ent: entCanon,
    prefix: 'BasicLed_',
  }


  const listSpec = {
    ...spec.def.list,
    ...sharedSpec,
  }

  const editSpec = {
    ...spec.def.edit,
    ...sharedSpec,

  }

  const headSpec = {
    ...spec.def.head,
    ...sharedSpec,
  }

  const footSpec = {
    ...spec.def.foot,
    ...sharedSpec,
  }


  return {
    exports: {
      spec: {
        list: listSpec,
        edit: editSpec,
        head: headSpec,
        foot: footSpec,
      }
    }
  }
}


VxgBasicLedPlugin.defaults = {
  spec: {},
  navigate: Function,
}


Object.defineProperty(VxgBasicLedPlugin, 'name', { value: 'VxgBasicLedPlugin' })

export {
  VxgBasicLedPlugin
}
