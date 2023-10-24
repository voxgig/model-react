import { describe, it } from 'vitest'
import * as React from 'react'

import { customRender, ctx, initialState, vxg } from './mocks/test-utils'
import { BasicAdmin } from '../src/lib/index'

describe('BasicAdmin', () => {

  it('happy', () => {

    const spec = { frame: 'private' }

    customRender(<BasicAdmin vxg={vxg} ctx={ctx} spec={spec} />, {
      mockInitialState: initialState,
    })
  })
})
