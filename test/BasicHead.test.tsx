import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import * as React from 'react'
import { customRender, ctx, initialState, vxg, spec } from './mocks/test-utils'
import { BasicHead } from '../src/lib/index'

describe('BasicHead', () => {
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
    const basicHeadSpec = {
      head: ctx().model.app.web.frame[frame].part.head,
      view: {}
    }

    const { screen } = customRender(
      <BasicHead vxg={vxg} ctx={ctx} spec={basicHeadSpec} />,
      {
        mockInitialState: initialState
      }
    )

    expect(screen.getByText('name')).toBeInTheDocument()
  })
})
