import { describe, it } from 'vitest'
import * as React from 'react'

import { customRender, ctx, initialState, vxg } from './mocks/test-utils'
import { BasicAdmin } from '../src/lib/index'

describe('BasicAdmin', () => {
  it('happy', () => {
    const basicAdminSpec = { frame: 'private' }

    customRender(<BasicAdmin vxg={vxg} ctx={ctx} spec={basicAdminSpec} />, {
      mockInitialState: initialState
    })
  })
})
