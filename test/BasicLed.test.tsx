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
    setLocation('/view/task/index')
  })

  afterEach(() => {
    setLocation(window.location.pathname)
  })

  it('renders an HTML table', () => {
    const frame = spec.frame
    const basicLedSpec = ctx().model.app.web.frame[frame].view.task

    const { screen } = customRender(
      <BasicLed vxg={vxg} ctx={ctx} spec={basicLedSpec} action='index' />,
      {
        mockInitialState: initialState
      }
    )

    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()
  })

  it('renders a task with title: Task 1', () => {
    const frame = spec.frame
    const basicLedSpec = ctx().model.app.web.frame[frame].view.task

    const { screen, debug } = customRender(
      <BasicLed vxg={vxg} ctx={ctx} spec={basicLedSpec} />,
      {
        mockInitialState: initialState
      }
    )

    // console.log(debug())

    const firstTask = screen.getByRole('cell', { name: 'Task 1' })
    expect(firstTask).toBeInTheDocument()
  })
})
