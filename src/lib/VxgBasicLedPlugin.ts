


function VxgBasicLedPlugin(this: any, options: any) {
  const seneca = this

  const spec = options.spec
  const navigate = options.navigate

  const name = spec.name
  const canon = spec.def.ent
  const slotName = 'BasicLed_' + name

  const ledent = seneca.make(canon)

  seneca
    .fix({ view: name })
    .add('aim:app,on:view,init:state,redux$:true',
      function(this: any, _msg: any, _reply: any, meta: any) {
        const state = meta.custom.state()
        let view = state.view[name]
        view.show = {
          list: true,
          edit: false
        }
        view.status = 'init'
        view.ready = true

        this.export('Redux/entityPrepare')(state, slotName)
      })
    .add('aim:app,on:view,list:item,redux$:true',
      function(_msg: any, _reply: any, meta: any) {
        let view = meta.custom.state().view[name]

        // TODO: these are mutually exclusive, maybe make a single value
        view.show.list = true
        view.show.edit = false
        view.status = 'list-item'
      })

    /*
      .add('aim:app,on:view,edit:start,redux$:true',
        { item_id: String },
        function(_msg: any, _reply: any, meta: any) {
          let view = meta.custom.state().view[name]
  
          // TODO: these are mutually exclusive, maybe make a single value
          view.show.list = false
          view.show.edit = true
          view.status = 'load-item'
        })
    */

    .message('aim:app,on:view,edit:item',
      { item_id: String },
      async function(this: any, msg: any) {
        const { item_id } = msg
        navigate('/view/' + name + '/edit/' + item_id)
        // this.act('aim:app,on:view,view:track,edit:start,direct$:true', { item_id })
        return await this.entity(canon).load$({
          id: msg.item_id,
          slot$: slotName,
        })
      })


    .message('aim:app,on:view,add:item',
      async function(this: any, msg: any) {
        await seneca.entity(canon).save$({ add$: true, slot$: slotName })
        navigate('/view/' + name + '/add')
      })

  seneca
    .prepare(async function(this: any) {
      this.act('aim:app,on:view,init:state,direct$:true', { view: name })
    })


  const entcanon = ledent.canon$({ object: true })
  const field = seneca.context.model.main.ent[entcanon.base][entcanon.name].field
  console.log('entcanon', entcanon, field)


  const sharedSpec = {
    name,
    ent: canon,
    prefix: 'BasicLed_',
    field,
  }


  const listSpec = {
    ...sharedSpec
  }

  const editSpec = {
    ...sharedSpec
  }

  const headSpec = {
    ...sharedSpec
  }

  const footSpec = {
    ...sharedSpec
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

Object.defineProperty(VxgBasicLedPlugin, 'name', { value: 'VxgBasicLedPlugin' })

export {
  VxgBasicLedPlugin
}
