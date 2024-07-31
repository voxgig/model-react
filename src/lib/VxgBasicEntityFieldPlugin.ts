// // This code does not belong here
// for (const field of fields) {
//     if ('Date' === field.ux.kind) {
//       const dt = util.dateTimeFromUTC(item[field.name])
//       item[field.name + '_orig$'] = item[field.name]
//       item[field.name + '_udm$'] = dt.udm
//       item[field.name] = dt.locald
//     } else if ('Time' === field.ux.kind) {
//       const dt = util.dateTimeFromUTC(item[field.name])
//       item[field.name + '_orig$'] = item[field.name]
//       item[field.name + '_udm$'] = dt.udm
//       item[field.name] = dt.localt
//     } else if ('DateTime' === field.ux.kind) {
//       const dt = util.dateTimeFromUTC(item[field.name])
//       item[field.name + '_orig$'] = item[field.name]
//       item[field.name + '_udm$'] = dt.udm
//       item[field.name] = dt.locald + 'T' + dt.localt
//     }
//   }

// on plugin define, we want to loop over all the fields,
// if the field is special(like datetime), seneca.add

import type { Spec } from './basic-types'

import { Gubu } from 'gubu'

const { Open, Child } = Gubu

const Shape = Gubu(
  Open({
    name: String,
    prefix: String,
    ent: String,
    order: [String],
    field: Child({}, {}),
  }),
  { name: 'BasicEntityEdit' }
)

function VxgBasicEntityFieldPlugin (this: any, options: any) {
  const seneca = this

  console.log('VxgBasicEntityFieldPlugin', options)

  options.setPlugin(true)

  return {
    exports: {
      handle: {},
    },
  }
}

Object.assign(VxgBasicEntityFieldPlugin, {
  defaults: {
    spec: {},
    setPlugin: Function,
  },
})

Object.defineProperty(VxgBasicEntityFieldPlugin, 'name', {
  value: 'VxgBasicEntityFieldPlugin',
})

export { VxgBasicEntityFieldPlugin }
