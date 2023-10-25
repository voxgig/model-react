import { describe, it } from 'vitest'
import * as React from 'react'
import { render } from '@testing-library/react'

import { BasicFoot } from '../src/lib/index'
import { ctx, spec } from './mocks/test-utils'

describe('BasicFoot', () => {
  it('happy', () => {
    const basicFootSpec = {
      foot: {
        title: ''
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

    render(<BasicFoot ctx={ctx} spec={basicFootSpec} />)
  })
})
