import { afterEach, beforeEach, describe, it } from 'vitest'
import * as React from 'react'

import { customRender, initialState } from './mocks/test-utils'
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
    const basicSideMenuItemSpec = {
      section: {
        title: 'Section 1',
        item: {
          task: {
            kind: 'resource',
            label: 'Tasks',
            icon: 'done',
            path: '/view/tasks',
            access: {
              admin: true,
              user: true
            }
          }
        }
      }
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
