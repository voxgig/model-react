import { describe, it } from 'vitest'
import * as React from 'react'

import { customRender, ctx, spec, initialState, vxg } from './mocks/test-utils'
import { BasicMain } from '../src/lib/index'

describe('BasicMain', () => {
  it('happy', () => {
    const frame = spec.frame
    const partMain = ctx().model.app.web.frame[frame].part.main
    const view = ctx().model.app.web.frame[frame].view
    const basicMainSpec = {
      main: partMain,
      view: view
    }

    console.log('basicMainSpec', basicMainSpec)

    customRender(<BasicMain vxg={vxg} ctx={ctx} spec={basicMainSpec} />, {
      mockInitialState: initialState
    })
  })
})
