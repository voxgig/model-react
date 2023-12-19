import { afterEach, beforeEach, describe, it } from 'vitest'
import * as React from 'react'

import { customRender, initialState, ctx, spec } from './mocks/test-utils'
import { BasicSideMenuItem } from '../src/lib/index'

describe('BasicSideMenuItem', () => {
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
    const basicSideMenuItemSpec = {
      section: frame.part.side.section.section1
    }
    const itemKey = 'task'

    customRender(
      <BasicSideMenuItem
        key={itemKey}
        spec={basicSideMenuItemSpec}
        onItemSelect={() => {}}
        onClose={() => {}}
      />,
      {
        mockInitialState: initialState
      }
    )
  })
})
