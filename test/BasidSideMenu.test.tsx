import { afterEach, beforeEach, describe, it } from 'vitest'
import * as React from 'react'

import { customRender, spec, ctx, initialState } from './mocks/test-utils'
import { BasicSideMenu } from '../src/lib/index'

describe('BasicSideMenu', () => {
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
    const frame = spec.frame
    const basicSideSpec = ctx().model.app.web.frame[frame].part.side
    const basicSideMenuSpec = {}
    customRender(
      <BasicSideMenu
        spec={{ section: basicSideSpec.section }}
        onItemSelect={() => {}}
        onClose={() => {}}
      />,
      {
        mockInitialState: initialState
      }
    )
  })
})
