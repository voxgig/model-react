import { describe, it } from 'vitest'
import * as React from 'react'

import { customRender, ctx, spec, initialState } from './mocks/test-utils'
import { BasicSide } from '../src/lib/index'

describe('BasicSide', () => {
  it('happy', () => {
    const sideSpec = {
      side: {
        logo: {
          img: 'img.png'
        }
      },
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

    customRender(<BasicSide ctx={ctx} spec={sideSpec} />, {
      mockInitialState: initialState
    })
  })
})
