import { describe, it, beforeEach, afterEach, expect } from 'vitest'
import * as React from 'react'

import { customRender, ctx, spec, initialState, vxg } from './mocks/test-utils'
import { BasicLed } from '../src/lib/index'

describe('BasicLed', () => {
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
    const basicLedSpec = ctx().model.app.web.frame[frame].view.task

    const { debug, screen } = customRender(
      <BasicLed vxg={vxg} ctx={ctx} spec={basicLedSpec} />,
      {
        mockInitialState: initialState
      }
    )

    // expect component to have a table
    expect(screen.getByRole('table')).toBeInTheDocument()

    // expect component to have a task named Task 1
    expect(screen.getByText('Task 1')).toBeInTheDocument()
  })
})
