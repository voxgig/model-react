



function VxgSeneca(this: any) {
  const seneca = this
  const { Exact } = seneca.valid

  seneca.root.context.cmap = cmap
  seneca.root.context.vmap = vmap

  seneca
    .message(
      'aim:app,prepare:app,redux$:true',
      async function prepareApp(_msg: any, meta: any) {
        let state = meta.custom.state()

        let model = seneca.context.model
        let frame = model.app.web.frame.private
        let viewMap = frame.view
        // let partMap = frame.part
        let sectionMap = frame.nav.section

        state.current = {
          view: '',
        }

        state.view = cmap(viewMap, {
          name: cmap.COPY,
          active: cmap.FILTER,
        })

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
      })

    .message(
      'aim:app,set:view,redux$:true',
      { view: String },
      async function setView(msg: any, meta: any) {
        meta.custom.state().current.view = msg.view
      })

    .message(
      'aim:app,area:nav,set:mode,redux$:true',
      { mode: Exact('shown', 'hidden') },
      async function setMode(msg: any, meta: any) {
        meta.custom.state().nav.mode = msg.mode
      })


    .prepare(async function(this: any) {
      await this.post('aim:app,prepare:app')
    })
}

// TODO: cmap,vmap probably belong in @voxgig/model utils

// Map child objects to new child objects
function cmap(o: any, p: any) {
  return Object
    .entries(o)
    .reduce((r: any, n: any, _: any) => (_ = Object
      .entries(p)
      .reduce((s: any, m: any) => (cmap.FILTER === s ? s : (s[m[0]] = (
        // transfom(val,key,current,parentkey,parent)
        'function' === typeof m[1] ? m[1](n[1][m[0]], {
          skey: m[0], self: n[1], key: n[0], parent: o
        }) : m[1]
      ), (cmap.FILTER === s[m[0]] ? cmap.FILTER : s))), {})
      , (cmap.FILTER === _ ? 0 : r[n[0]] = _), r), {})
}

cmap.COPY = (x: any) => x
// keep self if x is truthy, or function returning truthy-new-value or [truthy,new-value]
cmap.FILTER = (x: any) => 'function' === typeof x ? ((y: any, p: any, _: any) =>
  (_ = x(y, p), Array.isArray(_) ? !_[0] ? _[1] : cmap.FILTER : _)) : (x ? x : cmap.FILTER)
cmap.KEY = (_: any, p: any) => p.key


// Map child objects to a list of child objects
function vmap(o: any, p: any) {
  return Object
    .entries(o)
    .reduce((r: any, n: any, _: any) => (_ = Object
      .entries(p)
      .reduce((s: any, m: any) => (vmap.FILTER === s ? s : (s[m[0]] = (
        // transfom(val,key,current,parentkey,parent)
        // 'function' === typeof m[1] ? m[1](n[1][m[0]], m[0], n[1], n[0], o) : m[1]
        'function' === typeof m[1] ? m[1](n[1][m[0]], {
          skey: m[0], self: n[1], key: n[0], parent: o
        }) : m[1]
      ), (vmap.FILTER === s[m[0]] ? vmap.FILTER : s))), {})
      , (vmap.FILTER === _ ? 0 : r.push(_)), r), [])

}
vmap.COPY = (x: any) => x
vmap.FILTER = (x: any) => 'function' === typeof x ? ((y: any, p: any, _: any) =>
  (_ = x(y, p), Array.isArray(_) ? !_[0] ? _[1] : vmap.FILTER : _)) : (x ? x : vmap.FILTER)
vmap.KEY = (_: any, p: any) => p.key



export {
  VxgSeneca,
  cmap,
  vmap,
}
