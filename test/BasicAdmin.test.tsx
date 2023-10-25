import { describe, it } from 'vitest'
import * as React from 'react'

import { customRender, ctx, spec, initialState, vxg } from './mocks/test-utils'
import { BasicAdmin } from '../src/lib/index'

describe('BasicAdmin', () => {
  it('happy', () => {
    customRender(<BasicAdmin vxg={vxg} ctx={ctx} spec={spec} />, {
      mockInitialState: initialState
    })
  })
})
