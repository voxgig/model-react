
import type { Spec } from './basic-types'

import { Gubu } from 'gubu'

const { Open, Child } = Gubu

const Shape = Gubu(Open({
  name: String,
  prefix: String,
  ent: String,
  order: [String],
  field: Child({}, {})
}), { name: 'BasicEntityEdit' })


function VxgBasicEntityEditPlugin(this: any, options: any) {
  const seneca = this

  const spec = Shape(options.spec)

  const slot = spec.prefix + spec.name

  const fields = spec.order.reduce((a: any, fn: any) =>
    (fixField(fn, spec.field[fn], spec), a.push(spec.field[fn]), a), [])

  options.setPlugin(true)

  return {
    exports: {
      handle: {
        spec,
        slot,
        fields,
      }
    }
  }
}



function fixField(name: string, field: any, spec: any) {
  field.id = 'vxg-field-' + spec.name + '-' + name
  field.name = name
  field.ux = field.ux || {}
  field.ux.size = null == field.ux.size ? 4 : parseInt(field.ux.size, 10)
}




Object.assign(VxgBasicEntityEditPlugin, {
  defaults: {
    spec: {},
    setPlugin: Function,
  }
})


Object.defineProperty(VxgBasicEntityEditPlugin, 'name', { value: 'VxgBasicEntityEditPlugin' })

export {
  VxgBasicEntityEditPlugin
}
