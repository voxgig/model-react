
import type { Spec } from './basic-types'

import { Gubu } from 'gubu'

const { Open, Child } = Gubu

const Shape = Gubu(Open({
  name: String,
  prefix: String,
  ent: String,
  order: [String],
  field: Child({}, {})
}), { name: 'BasicEntityList' })


function VxgBasicEntityListPlugin(this: any, options: any) {
  const seneca = this

  const spec = Shape(options.spec)

  const slot = spec.prefix + spec.name

  // TODO: error if field missing
  const columns = spec.order.reduce((a: any, fn: any) => {
    const field = spec.field[fn]
    a.push({
      accessorKey: fn,
      header: field.label,
      Cell: options.cell[fn],
    })
    return a
  }, [])

  options.setPlugin(true)

  return {
    exports: {
      handle: {
        spec,
        slot,
        columns,
        buildFilter,
      }
    }
  }
}


function buildFilter(query: any) {
  const filter = Object.entries(query)
    .reduce((a: any, n) => ((n[0].startsWith('f_') ? a[n[0].substring(2)] = n[1] : null), a), {})

  const filterDesc = Object.entries(filter)
    .reduce((a: any, n) => a + '~' + n[0] + '=' + n[1], '')

  return { filter, filterDesc }
}


Object.assign(VxgBasicEntityListPlugin, {
  defaults: {
    spec: {},
    cell: {},
    setPlugin: Function,
  }
})


Object.defineProperty(VxgBasicEntityListPlugin, 'name', { value: 'VxgBasicEntityListPlugin' })

export {
  VxgBasicEntityListPlugin
}
