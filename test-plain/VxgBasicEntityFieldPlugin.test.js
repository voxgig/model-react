require('ts-node')

const { test, describe } = require('node:test')

const { expect } = require('@hapi/code')

const Seneca = require('seneca')

const {
  VxgBasicEntityFieldPlugin,
} = require('../dist-plain/lib/VxgBasicEntityFieldPlugin')

describe('VxgBasicEntityFieldPlugin', () => {
  test('load-plugin', async () => {
    const seneca = await makeSeneca()
    expect(seneca.find_plugin('VxgBasicEntityFieldPlugin$foo')).exist()
    await seneca.close()
  })
})

async function makeSeneca (opts) {
  const { deep } = Seneca.util
  return Seneca({ legacy: false })
    .test()
    .use('promisify')
    .use('entity')
    .use('redux', {
      name: 'main',
      state: {
        view: {
          foo: {},
        },
      },
    })
    .use({
      name: 'VxgBasicEntityFieldPlugin$foo',
      define: VxgBasicEntityFieldPlugin,
      options: deep(
        {
          setPlugin: () => null,
          spec: {
            active: false,
            name: 'foo',
            prefix: 'BasicLed_',
            ent: 'foo/bar',
            order: ['title'],
            field: {
              title: {
                label: 'Title',
                kind: 'String',
                valid: 'Min(2).Max(1111)',
                ux: {
                  kind: 'Text',
                  edit: true,
                  rows: 3,
                  size: 4,
                  props: {},
                },
                id: 'vxg-field-podcast-title',
                name: 'title',
              },
            },
          },
        },
        opts
      ),
    })
    .ready()
}
