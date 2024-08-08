require('ts-node')

const { test, describe } = require('node:test')

const { expect } = require('@hapi/code')

const Seneca = require('seneca')

const {
  VxgBasicEntityEditPlugin,
} = require('../dist-plain/lib/VxgBasicEntityEditPlugin')

describe('VxgBasicEntityEditPlugin', () => {
  test('load-plugin', async () => {
    const seneca = await makeSeneca()
    expect(seneca.find_plugin('VxgBasicEntityEditPlugin$foo')).exist()
    await seneca.close()
  })

  test('util-datetime', async () => {
    const seneca = await makeSeneca()
    const { dateTimeFromUTC } = seneca.export('VxgBasicEntityEditPlugin/util')
    const d0 = new Date(1717173005742)
    const o0 = dateTimeFromUTC(d0, 'Europe/Dublin')
    // console.log(new Date(d0), o0)
    expect(o0).contains({
      udm: 59405742,
      isod: '2024-05-31',
      isot: '16:30:05',
      locald: '2024-05-31',
      localt: '17:30:05',
    })
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
      name: 'VxgBasicEntityEditPlugin$foo',
      define: VxgBasicEntityEditPlugin,
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
