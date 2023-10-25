import { afterEach, beforeEach, describe, it } from 'vitest'
import * as React from 'react'

import { customRender, ctx, initialState } from './mocks/test-utils'
import { BasicSide } from '../src/lib/index'

describe('BasicSide', () => {
  const setLocation = (pathname: string) => {
    Object.defineProperty(window, 'location', {
      value: {
        pathname
      }
    });
  }

  beforeEach(() => {
    setLocation('/view/task');
  });

  afterEach(() => {
    setLocation(window.location.pathname);
  });

  it('happy', () => {

    const sideSpec = {
      side: {
        logo: {
          img: "img.png"
        },
        section: {
          section1: {
            title: "Section 1",
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
      },
      view: {
        task: {
          title: "Task",
          icon: "done",
          content: {}
        }
      }
    }

    customRender(<BasicSide ctx={ctx} spec={sideSpec} />, {
      mockInitialState: initialState,
    })
  })
})
