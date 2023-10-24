import { describe, it } from 'vitest'
import * as React from 'react'

import { customRender, ctx, initialState } from './mocks/test-utils'
import { BasicSide } from '../src/lib/index'

describe('BasicSide', () => {
  it('happy', () => {

    const sideSpec = {
      side: {
        logo: {
          img: "img.png"
        },
        section: {
          section1: {
            title: "Section 1",
          }
        }
      },
      view: {}
    }

    customRender(<BasicSide ctx={ctx} spec={sideSpec} />, {
      mockInitialState: initialState,
    })
  })
})
