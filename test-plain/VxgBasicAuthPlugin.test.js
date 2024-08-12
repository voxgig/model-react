require('ts-node')

const { test, describe } = require('node:test')

const { expect } = require('@hapi/code')

const Seneca = require('seneca')

const { VxgBasicAuthPlugin } = require('../dist-plain/lib/VxgBasicAuthPlugin')

describe('VxgBasicAuthPlugin', () => {
  test('load-plugin', async () => {
    const seneca = await makeSeneca()
    expect(seneca.find_plugin('VxgBasicAuthPlugin$foo')).exist()
    await seneca.close()
  })
})

async function makeSeneca (opts) {
  const { deep } = Seneca.util
  const seneca = Seneca({ legacy: false })
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

  seneca.context.model = {
    app: {
      web: {
        frame: {
          public: {
            kind: 'basic',
            part: {
              main: {
                view: {
                  default: 'dash',
                },
              },
            },
            page: {
              auth: {
                title: 'Sign In',
                img: {
                  logo: '/logo.png',
                },
                signin: {
                  debug: false,
                  view: 'dash',
                },
              },
            },
            name: 'public',
            nav: {
              section: {},
            },
          },
          private: {
            kind: 'basic',
            nav: {
              section: {
                one: {
                  name: 'one',
                  item: {
                    dash: {
                      name: 'dash',
                      view: 'dash',
                      active: true,
                    },
                  },
                  active: true,
                },
              },
            },
            tool: {
              logo: {
                name: 'logo',
                kind: 'logo',
                attr: {
                  img: '/logo.png',
                },
              },
            },
            part: {
              head: {
                tool: {
                  logo: {
                    active: true,
                    align: 'left',
                  },
                },
                name: 'head',
                active: true,
              },
              side: {
                name: 'side',
                active: true,
              },
              main: {
                view: {
                  default: 'dash',
                },
                name: 'main',
                active: true,
              },
              foot: {
                name: 'foot',
                active: true,
              },
            },
            view: {
              dash: {
                title: 'Dashboard',
                active: true,
                kind: 'custom',
                cmp: 'Dash',
                def: {},
                name: 'dash',
              },
            },
            name: 'private',
          },
        },
      },
    },
  }

  seneca
    .use({
      name: 'VxgBasicAuthPlugin$foo',
      define: VxgBasicAuthPlugin,
      options: deep(
        {
          setReady: () => null,
        },
        opts
      ),
    })
    .ready()

  return seneca
}
