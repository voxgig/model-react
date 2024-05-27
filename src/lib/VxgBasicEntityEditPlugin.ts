
import type { Spec } from './basic-types'

import { Gubu } from 'gubu'

const { Open, Child } = Gubu

const Shape = Gubu(Open({
  name: String,
  prefix: String,
  ent: String,
  order: [String],
  field: Child({}, {})
}), { prefix: 'BasicEntityEdit' })


function VxgBasicEntityEditPlugin(this: any, options: any) {
  const seneca = this

  const spec = Shape(options.spec)

  console.log('QQQ', spec)

  const slot = spec.prefix + spec.name

  const fields = Object.entries(spec.field)
    .reduce((a: any, n: any) => (fixField(n, spec), a.push(n[1]), a), [])


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



function fixField(fieldEntry: [string, any], spec: any) {
  const name = fieldEntry[0]
  const field = fieldEntry[1]
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
