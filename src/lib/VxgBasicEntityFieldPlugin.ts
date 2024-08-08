import { Gubu } from 'gubu'

const { Open, Child } = Gubu

const Shape = Gubu(
  Open({
    field: {},
  }),
  { name: 'BasicEntityField' }
)

function VxgBasicEntityFieldPlugin (this: any, options: any) {
  const seneca = this

  const spec = Shape(options.spec)

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
