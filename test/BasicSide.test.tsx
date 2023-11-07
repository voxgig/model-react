import { afterEach, beforeEach, describe, it } from 'vitest'
import * as React from 'react'

import { customRender, ctx, initialState, spec } from './mocks/test-utils'
import { BasicSide } from '../src/lib/index'

describe('BasicSide', () => {
  const setLocation = (pathname: string) => {
    Object.defineProperty(window, 'location', {
      value: {
        pathname
      }
    })
  }

  beforeEach(() => {
    setLocation('/view/task')
  })

  afterEach(() => {
    setLocation(window.location.pathname)
  })

  it('happy', () => {
    const frame = ctx().model.app.web.frame[spec.frame]
    const basicSideSpec = {
      side: frame.part.side,
      view: frame.view
    }

    customRender(<BasicSide ctx={ctx} spec={basicSideSpec} />, {
      mockInitialState: initialState
    })
  })
})
