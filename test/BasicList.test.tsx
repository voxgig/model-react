import { describe, it } from 'vitest'
import * as React from 'react'

import { customRender, ctx, spec, initialState } from './mocks/test-utils'
import { BasicList } from '../src/lib/index'

describe('BasicList', () => {
  it('happy', () => {
    let data = {}
    let columns = []
    customRender(
      <BasicList ctx={ctx} spec={spec} data={data} columns={columns} />,
      {
        mockInitialState: initialState
      }
    )
  })
})
