import { describe, it, beforeEach, afterEach } from 'vitest'
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
    const view = {
      title: 'task',
      icon: 'done',
      content: {
        kind: 'led',
        def: {
          ent: {
            canon: 'vxg/task',
            primary: {
              field: {
                id: {
                  title: 'ID',
                  edit: true
                }
              }
            }
          },
          add: { active: false },
          edit: {
            layout: {
              order: 'id,title,status',
              field: {
                id: {
                  title: 'ID',
                  edit: true
                },
                title: {
                  title: 'Title',
                  edit: true
                },
                status: {
                  title: 'Status',
                  edit: true
                }
              }
            }
          }
        }
      }
    }

    customRender(<BasicLed vxg={vxg} ctx={ctx} spec={view} />, {
      mockInitialState: initialState
    })
  })
})
