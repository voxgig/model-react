import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import * as React from 'react'
import { customRender, ctx, spec, initialState, vxg } from './mocks/test-utils'
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
    const headSpec = {
      head: {
        logo: { img: 'img.png' },
        tool: { def: [] }
      },
      view: {
        task: {
          content: {
            def: {
              add: {}
            }
          },
          name: 'task'
        }
      }
    }

    const { screen } = customRender(
      <BasicHead vxg={vxg} ctx={ctx} spec={headSpec} />,
      {
        mockInitialState: initialState
      }
    )

    expect(screen.getByText('name')).toBeInTheDocument()
  })
})
