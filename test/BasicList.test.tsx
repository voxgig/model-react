import { describe, it } from 'vitest'
import * as React from 'react'

import { customRender, ctx, spec, initialState } from './mocks/test-utils'
import { BasicList } from '../src/lib/index'

describe('BasicList', () => {
  it('happy', () => {
    let data = {}
    let columns = []
    const frame = spec.frame
    const basicLedSpec = ctx().model.app.web.frame[frame].view.task

    customRender(
      <BasicList ctx={ctx} spec={basicLedSpec} data={data} columns={columns} />,
      {
        mockInitialState: initialState
      }
    )
  })
})
