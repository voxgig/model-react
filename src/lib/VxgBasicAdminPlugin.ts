
import { vmap, cmap } from './vxg-util'


function VxgBasicAdminPlugin(this: any) {
  const seneca = this
  const { Exact, Default } = seneca.valid

  seneca.root.context.cmap = cmap
  seneca.root.context.vmap = vmap

  seneca
    .message('aim:app,prepare:app,redux$:true', prepareApp)

    .message(
      'aim:app,sync:view,redux$:true',
      { name: String, query: {}, hash: Default('') },
      syncView
    )

    .message(
      'aim:app,area:nav,set:mode,redux$:true',
      { mode: Exact('shown', 'hidden') },
      setMode
    )


    .message(
      'aim:app,on:nav,set:path',
      { navigate: Function, view: String },
      setPath
    )


    .prepare(async function(this: any) {
      await this.post('aim:app,prepare:app')
      console.log('VxgBasicAdminPlugin prep done')
    })


  async function setPath(msg: any, meta: any) {
    const q = Object.entries(msg.query)
      .reduce((s: any, n: any) =>
      (s + ('' === s ? '?' : '') +
        (encodeURIComponent(n[0]) + '=' + encodeURIComponent(n[1]))), '')
    const path = '/view/' + msg.view + q
    console.log('PATH', path)
    msg.navigate(path)
  }


  async function setMode(msg: any, meta: any) {
    meta.custom.state().nav.mode = msg.mode
  }


  async function syncView(msg: any, meta: any) {
    meta.custom.state().current.view.name = msg.name
    meta.custom.state().current.view.query = msg.query
    meta.custom.state().current.view.hash = msg.hash
    console.log('syncView', msg.name)
  }

  async function prepareApp(_msg: any, meta: any) {
    let state = meta.custom.state()

    let model = seneca.context.model
    let frame = model.app.web.frame.private
    let viewMap = frame.view
    // let partMap = frame.part
    let sectionMap = frame.nav.section

    state.current = {
      view: {
        name: '',
        query: {},
        hash: ''
      }
    }

    const viewState = cmap(viewMap, {
      name: cmap.COPY,
      active: cmap.FILTER,
    })
    state.view = viewState

    state.nav = {
      mode: 'shown',
      section: cmap(sectionMap, {
        name: cmap.COPY,
        active: cmap.FILTER,
        item: (x: any) => cmap(x, {
          active: cmap.FILTER,
          view: cmap.COPY,
          name: cmap.COPY,
        })
      })
    }
  }

}




export {
  VxgBasicAdminPlugin,
}
