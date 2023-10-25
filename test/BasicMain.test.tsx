import { describe, it } from 'vitest'
import * as React from 'react'

import { customRender, ctx, spec, initialState, vxg } from './mocks/test-utils'
import { BasicMain } from '../src/lib/index'

describe('BasicMain', () => {
  it('happy', () => {
    const basicMainSpec = {
      main: {},
      view: {
        task: {
          content: {
            def: {
              add: {}
            }
          },
          name: 'task'
        }
      }
    }

    customRender(<BasicMain vxg={vxg} ctx={ctx} spec={basicMainSpec} />, {
      mockInitialState: initialState
    })
  })
})
