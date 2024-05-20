

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



function searchParamsToObject(searchParams: URLSearchParams) {
  let params: any = Object.create(null)
  for (let [key, value] of searchParams.entries()) {
    params[key] = value
  }
  return params
}



export {
  cmap,
  vmap,
  searchParamsToObject,
}
