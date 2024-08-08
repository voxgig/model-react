// TODO: cmap,vmap probably belong in @voxgig/model utils

import { useId } from 'react'

// Map child objects to new child objects
function cmap (o: any, p: any) {
  return Object.entries(o).reduce(
    (r: any, n: any, _: any) => (
      (_ = Object.entries(p).reduce(
        (s: any, m: any) =>
          cmap.FILTER === s
            ? s
            : ((s[m[0]] =
                // transfom(val,key,current,parentkey,parent)
                'function' === typeof m[1]
                  ? m[1](n[1][m[0]], {
                      skey: m[0],
                      self: n[1],
                      key: n[0],
                      parent: o,
                    })
                  : m[1]),
              cmap.FILTER === s[m[0]] ? cmap.FILTER : s),
        {}
      )),
      cmap.FILTER === _ ? 0 : (r[n[0]] = _),
      r
    ),
    {}
  )
}

cmap.COPY = (x: any) => x
// keep self if x is truthy, or function returning truthy-new-value or [truthy,new-value]
cmap.FILTER = (x: any) =>
  'function' === typeof x
    ? (y: any, p: any, _: any) => (
        (_ = x(y, p)), Array.isArray(_) ? (!_[0] ? _[1] : cmap.FILTER) : _
      )
    : x
    ? x
    : cmap.FILTER
cmap.KEY = (_: any, p: any) => p.key

// Map child objects to a list of child objects
function vmap (o: any, p: any) {
  return Object.entries(o).reduce(
    (r: any, n: any, _: any) => (
      (_ = Object.entries(p).reduce(
        (s: any, m: any) =>
          vmap.FILTER === s
            ? s
            : ((s[m[0]] =
                // transfom(val,key,current,parentkey,parent)
                // 'function' === typeof m[1] ? m[1](n[1][m[0]], m[0], n[1], n[0], o) : m[1]
                'function' === typeof m[1]
                  ? m[1](n[1][m[0]], {
                      skey: m[0],
                      self: n[1],
                      key: n[0],
                      parent: o,
                    })
                  : m[1]),
              vmap.FILTER === s[m[0]] ? vmap.FILTER : s),
        {}
      )),
      vmap.FILTER === _ ? 0 : r.push(_),
      r
    ),
    []
  )
}
vmap.COPY = (x: any) => x
vmap.FILTER = (x: any) =>
  'function' === typeof x
    ? (y: any, p: any, _: any) => (
        (_ = x(y, p)), Array.isArray(_) ? (!_[0] ? _[1] : vmap.FILTER) : _
      )
    : x
    ? x
    : vmap.FILTER
vmap.KEY = (_: any, p: any) => p.key

function searchParamsToObject (searchParams: URLSearchParams) {
  let params: any = Object.create(null)
  for (let [key, value] of searchParams.entries()) {
    params[key] = value
  }
  return params
}

// Map a value (object, array, or string) to a value or array of values using a map function
// TODO: possibly not the best place for this, maybe in a plugin?
function resvalue (
  value: object | any[] | string,
  cat: { multiple: number; item: Record<string, { title: string }> },
  mapFn: (val: string, item: { title: string }) => any
) {
  const { item: items, multiple } = cat

  if (Object.keys(items).length === 0) {
    return multiple === 1 ? '' : []
  }

  if (Array.isArray(value)) {
    return multiple === 1 && value[0] ? value[0] : value.slice(0, multiple)
  }

  if (typeof value === 'object') {
    return multiple === 1 ? value : [value]
  }

  const splitValue = value.split(',')

  const mapValue = (val: string) =>
    items[val] ? mapFn(val, items[val]) : undefined

  switch (multiple) {
    case 1:
      return mapValue(splitValue[0]) || ''
    case -1:
      return splitValue.map(mapValue).filter(Boolean) || []
    default:
      return splitValue.slice(0, multiple).map(mapValue).filter(Boolean)
  }
}

// Map a string to a value or array of values using a map function
// TODO: possibly not the best place for this, maybe in a plugin?
function resdefault (
  cat: {
    multiple: number
    item: Record<string, { title: string }>
    default: string
  },
  mapFn: (val: string, item: { title: string }) => any
) {
  const { multiple, item: items, default: defaultValues } = cat

  if (Object.keys(items).length === 0) {
    return multiple === 1 ? '' : []
  }

  const defaultItems = defaultValues.split(',')

  const mapResolvedDefault = (list: string[]) =>
    list.map((val: string) => (items[val] ? mapFn(val, items[val]) : undefined))

  switch (multiple) {
    case 1:
      return defaultItems[0]
        ? mapFn(defaultItems[0], items[defaultItems[0]])
        : ''
    case -1:
      return mapResolvedDefault(defaultItems).filter(Boolean) || []
    default:
      return (
        mapResolvedDefault(defaultItems.slice(0, multiple)).filter(Boolean) ||
        []
      )
  }
}

function useSanitizedId () {
  const id = useId()
  const sanitizedId = id.replace(/[^a-zA-Z0-9_]/g, 'x')
  return sanitizedId
}

export {
  cmap,
  vmap,
  searchParamsToObject,
  resvalue,
  resdefault,
  useSanitizedId,
}
