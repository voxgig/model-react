require('ts-node')

const { test, describe } = require('node:test')

const { expect } = require('@hapi/code')

const Seneca = require('seneca')

const { VxgBasicLedPlugin } = require('../dist-plain/lib/VxgBasicLedPlugin')

describe('VxgBasicLedPlugin', () => {
  test('load-plugin', async () => {
    const seneca = await makeSeneca()
    expect(seneca.find_plugin('VxgBasicLedPlugin$foo')).exist()
    await seneca.close()
  })

  test('ready-list', async () => {
    const seneca = await makeSeneca()
    const store = seneca.export('Redux/store')
    expect(store.getState().main.view.foo).equal({
      mode: 'list',
      status: 'init',
      ready: true,
    })

    await seneca.post('aim:app,on:BasicLed,ready:list,view:foo', {
      setReady: () => null,
    })
    expect(store.getState().main.view.foo).equal({
      mode: 'list',
      status: 'list-item',
      ready: true,
    })
    await seneca.close()
  })

  test('ready-edit', async () => {
    const seneca = await makeSeneca()
    const store = seneca.export('Redux/store')
    expect(store.getState().main.view.foo).equal({
      mode: 'list',
      status: 'init',
      ready: true,
    })

    await seneca.post('aim:app,on:BasicLed,ready:edit,view:foo', {
      setReady: () => null,
    })
    expect(store.getState().main.view.foo).equal({
      mode: 'edit',
      status: 'edit-item',
      ready: true,
    })
    await seneca.close()
  })

  // test('util-datetime', async () => {
  //   const seneca = await makeSeneca()
  //   const { dateTimeFromUTC } = seneca.export('VxgBasicLedPlugin/util')

  //   const d0 = new Date(1717173005742)
  //   const o0 = dateTimeFromUTC(d0,'Europe/Dublin')

  //   // console.log(new Date(d0), o0)
  //   expect(o0).contains({
  //     udm: 59405742,
  //     isod: '2024-05-31',
  //     isot: '16:30:05',
  //     locald: '2024-05-31',
  //     localt: '17:30:05'
  //   })

  //   await seneca.close()
  // })
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
      name: 'VxgBasicLedPlugin$foo',
      define: VxgBasicLedPlugin,
      options: deep(
        {
          navigate: () => null,
          spec: {
            name: 'foo',
            title: 'title',
            active: true,
            kind: 'led',
            def: {
              ent: 'foo',
              head: {
                active: true,
              },
              list: {
                active: true,
              },
              edit: {
                active: true,
              },
              foot: {
                active: true,
              },
            },
          },
        },
        opts
      ),
    })
    .ready()
}
