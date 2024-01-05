



function VxgSeneca(this: any) {
  const seneca = this
  const { Exact } = seneca.valid

  seneca.root.context.cmap = cmap
  seneca.root.context.vmap = vmap

  seneca
    .message(
      'aim:app,prepare:app,redux$:true',
      async function prepareApp(_msg: any, meta: any) {
        let state = meta.custom.state

        let model = seneca.context.model
        let frame = model.app.web.frame.private
        let viewMap = frame.view
        // let partMap = frame.part
        let sectionMap = frame.nav.section

        state.current = {
          view: '',
        }

        state.view = cmap(viewMap, {
          name: cmap.ID,
          active: cmap.DEL,
        })

        state.nav = {
          mode: 'shown',
          section: cmap(sectionMap, {
            name: cmap.ID,
            active: cmap.DEL,
            item: (x: any) => cmap(x, {
              active: cmap.DEL,
              view: cmap.ID,
              name: cmap.ID,
            })
          })
        }
      })

    .message(
      'aim:app,set:view,redux$:true',
      { view: String },
      async function setView(msg: any, meta: any) {
        meta.custom.state.current.view = msg.view
      })

    .message(
      'aim:app,area:nav,set:mode,redux$:true',
      { mode: Exact('shown', 'hidden') },
      async function setMode(msg: any, meta: any) {
        meta.custom.state.nav.mode = msg.mode
      })


    .prepare(async function(this: any) {
      await this.post('aim:app,prepare:app')
    })
}

// Map child objects to new child objects
function cmap(o: any, p: any) {
  return Object
    .entries(o)
    .reduce((r: any, n: any, _: any) => (_ = Object
      .entries(p)
      .reduce((s: any, m: any) => (cmap.DEL === s ? s : (s[m[0]] = (
        // transfom(val,key,current,parentkey,parent)
        'function' === typeof m[1] ? m[1](n[1][m[0]], m[0], n[1], n[0], o) : m[1]
      ), (cmap.DEL === s[m[0]] ? cmap.DEL : s))), {})
      , (cmap.DEL === _ ? 0 : r[n[0]] = _), r), {})
}
cmap.ID = (x: any) => x
// x is truthy, or if a function, return [truthy,new-value]
cmap.DEL = (x: any) => 'function' === typeof x ? ((y: any, k: string, c: any, j: string, p: any, _: any) => (_ = x(y, k, c, j, p,), !_[0] ? _[1] : cmap.DEL)) : (x ? x : cmap.DEL)
cmap.KEY = (_x: any, _k: string, _c: any, j: string) => j

// Map child objects to a list of child objects
function vmap(o: any, p: any) {
  return Object
    .entries(o)
    .reduce((r: any, n: any, _: any) => (_ = Object
      .entries(p)
      .reduce((s: any, m: any) => (vmap.DEL === s ? s : (s[m[0]] = (
        // transfom(val,key,current,parentkey,parent)
        'function' === typeof m[1] ? m[1](n[1][m[0]], m[0], n[1], n[0], o) : m[1]
      ), (vmap.DEL === s[m[0]] ? vmap.DEL : s))), {})
      , (vmap.DEL === _ ? 0 : r.push(_)), r), [])

}
vmap.ID = (x: any) => x
vmap.DEL = (x: any) => 'function' === typeof x ? ((y: any, k: string, c: any, j: string, p: any, _: any) => (_ = x(y, k, c, j, p,), !_[0] ? _[1] : vmap.DEL)) : (x ? x : vmap.DEL)
vmap.KEY = (_x: any, _k: string, _c: any, j: string) => j



export {
  VxgSeneca,
  cmap,
  vmap,
}
