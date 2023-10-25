import { describe, it } from 'vitest'
import * as React from 'react'
import { render } from '@testing-library/react'

import { BasicAuth } from '../src/lib/index'
import { ctx, spec } from './mocks/test-utils'

describe('BasicAuth', () => {
  it('happy', () => {
    const specAuth: any = {
      auth: {
        frame: 'public',
        title: 'Sign in',
        img: {
          logo: '/voxgig.png'
        },
        handle: {}
      }
    }

    render(<BasicAuth ctx={ctx} spec={specAuth.auth} />)
  })
})
