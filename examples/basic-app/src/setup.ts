import Seneca from 'seneca-browser'
import SenecaEntity from 'seneca-entity'

import produce from 'immer'
import { configureStore, createSlice, current } from '@reduxjs/toolkit'

import Pkg from '../package.json'

import BrowserStore from './browser-store'

// TODO: only pull in a subset, private/public
import Model from '../model/model.json'

let main: any = null

export function getMain () {
  if (null != main) {
    return main
  }

  main = {
    model: Model,
    info: {
      version: Pkg.version
    },
    handler: {
      load_auth,
      boot
    }
  }

  // Fix up model
  // TODO: move to @voxgig/model, aontu feature
  // use .$KEY
  Object.entries(main.model.app.web.frame.private.view).map(
    (entry: any) => ((entry[1].name = entry[0]), entry[1])
  )

  const mainSlice = createSlice({
    name: 'main',
    initialState: {
      auth: {
        state: 'none'
      },
      vxg: {
        trigger: {
          led: {
            add: 0
          }
        },
        cmp: {
          BasicHead: {
            tool: [{ selected: true }, { selected: false }]
          },
          BasicSide: {
            show: true
          }
        },
        ent: {
          list: {
            main: {
              'vxg/talk': []
            }
          },
          meta: {
            main: {
              'vxg/talk': { state: 'none' }
            }
          }
        }
      }
    },
    reducers: {
      entityResponse: (state: any, action: any) => {
        let payload: any = action.payload

        console.log('[debug]redux.entityResponse', payload)

        let msg = payload.msg
        let res = payload.res

        if (false !== msg.q?.store$ && false !== msg.ent?.store$ && res) {
          if ('load' === msg.cmd || 'save' === msg.cmd) {
            let canon = msg.ent.entity$.replace(/^(-\/)+/, '')

            // map senea response to store (single item)
            state.vxg.ent.list.main[canon] = state.vxg.ent.list.main[canon].map(
              (item: any) => {
                if (item.id === res.id) {
                  return { ...item, ...res }
                } else {
                  return item
                }
              }
            )
          }
          // else if ('entity' === msg.list) {
          else if ('list' === msg.cmd) {
            let canon = msg.qent.entity$.replace(/^(-\/)+/, '')

            // map seneca response to store
            state.vxg.ent.list.main[canon] = res.map((item: any) => ({
              ...item
            }))

            // mark as loaded
            state.vxg.ent.meta.main[canon].state = 'loaded'
          }
        }
      },

      response: (state: any, action: any) => {
        let payload: any = action.payload

        console.log('[debug]redux.response', payload)

        let msg = payload.msg
        let res = payload.res

        let updatelist: any =
          res.update ||
          (res.section ? [{ section: res.section, content: res.content }] : [])

        for (let update of updatelist) {
          // Format: a.b.c=1 => set {a:{b:{c:1}}}
          let section = update.section
          let content = update.content

          if (section) {
            let levels = section.split('.')
            let last = levels[levels.length - 1]
            levels.length = levels.length - 1
            let base = state
            for (let levelI = 0; levelI < levels.length; levelI++) {
              base = base[levels[levelI]] = base[levels[levelI]] || {}
            }
            if (null != last) {
              base[last] = content
            }
          }
        }

        let handler = res.handler

        if (handler && main.handler[handler]) {
          main.handler[handler](state, res, msg, main)
        }
      }
    }
  })

  const { response, entityResponse } = mainSlice.actions
  Object.assign(response, { mark$: 'response' })
  Object.assign(entityResponse, { mark$: 'entityResponse' })

  const store = configureStore({
    reducer: {
      main: mainSlice.reducer
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['main/response', 'main/entityResponse']
        }
      })
  })

  let endpoint = (msg: any) => {
    let suffix =
      '/api/web' + ('auth' === msg.on ? '/public/auth' : '/private/' + msg.on)
    let url = document.location.origin + suffix

    return url
  }

  const seneca = Seneca({
    legacy: false,
    log: { logger: 'flat', level: 'warn' },
    plugin: {
      browser: {
        endpoint,
        headers: {},
        fetch: {
          credentials: 'include'
        }
      }
    },
    timeout: 44444
  })
    // .test('print')
    .test()
    .use(SenecaEntity)

    .use(BrowserStore)

    .client({
      type: 'browser',
      pin: ['aim:web']
    })

    .sub('aim:web,in$:true', function (msg: any, res: any) {
      console.log('[debug]aim:web,in$:true', msg, res)
    })

    .sub('aim:web,out$:true', function (msg: any, res: any) {
      console.log('[debug]aim:web,out$:true', msg, res)
      let action: any = 'entity' === msg.on ? null : response
      if (action) {
        store.dispatch(action({ msg, res } as any))
      }
    })

    .sub('sys:entity,out$:true', function (msg: any, res: any) {
      console.log('[debug]sys:entity,out$:true', msg, res)
      store.dispatch(entityResponse({ msg, res } as any))
    })

    // mock seneca backend

    .add('aim:web,on:auth,load:auth', function (msg: any, reply: any) {
      const authenticated = true
      var payload = {}
      if (!authenticated) {
        payload = {
          ok: true,
          section: 'auth.state',
          content: 'signedout'
        }
      } else {
        payload = {
          ok: true,
          section: 'auth.state',
          content: 'signedin',
          handler: 'load_auth',
          user: {
            id: 'u01',
            email: 'alice@example.com',
            name: 'Alice',
            handle: 'alice',
            role: 'guest'
          }
        }
      }
      reply(null, payload)
    })

    .add(
      'aim:web,list:entity,canon:-/vxg/talk',
      function (msg: any, reply: any) {
        console.log('[debug]aim:web,list:entity', msg)
        reply(null, {
          ok: true,
          list: [
            {
              entity$: '-/vxg/talk',
              id: 't01',
              title: 'Talk 1',
              status: 'open'
            },
            {
              entity$: '-/vxg/talk',
              id: 't02',
              title: 'Talk 2',
              status: 'closed'
            },
            {
              entity$: '-/vxg/talk',
              id: 't03',
              title: 'Talk 3',
              status: 'open'
            }
          ]
        })
      }
    )

    .add('aim:web,on:auth,signin:user', function (msg: any, reply: any) {
      reply(null, {
        ok: true,
        user: {
          active: true,
          email: 'alice@example.com',
          entity$: '-/sys/user',
          handle: 'alice',
          id: 'u01',
          name: 'Alice',
          role: 'guest'
        }
      })
    })

    // state management
    .add('aim:app,set:state', function (msg: any, reply: any) {
      console.log('[debug]aim:app,set:state', msg)
      const res = { ...msg, update: undefined }
      store.dispatch(response({ msg, res } as any))

      reply({
        update: msg.update,
        section: msg.section,
        content: msg.content
      })
    })

  seneca.root.order.inward.add({
    name: 'debounce',
    before: 'inward_msg_modify',
    exec: function (spec: any) {
      let msg = spec.data.msg

      if (msg.debounce$) {
        let log = spec.ctx.seneca.status().history.log

        let actdef = spec.ctx.seneca.find(msg)
        if (!actdef) return

        for (let i = log.length - 1; -1 < i; i--) {
          if (
            log[i].meta.pattern === actdef.pattern &&
            // Only drop if there's a previous inflight
            0 === log[i].result.length
          ) {
            return {
              // TODO: need a `drop` operation
              op: 'stop',
              out: {
                kind: 'result',
                result: {}
              }
            }
          }
        }
      }
    }
  })

  main.seneca = seneca
  main.store = store
  ;(window as any).main = main

  return main
}

function load_auth (state: any, res: any, msg: any, main: any) {
  state.auth.user = res.user
}

function boot (state: any, res: any, msg: any, main: any) {
  state.boot.state = 'done'
}
