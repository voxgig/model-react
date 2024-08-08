import { describe, it, expect, beforeEach } from 'vitest'

import { resolveCategories, resolveDefault } from '../src/lib/BasicEntityRadioGroupField'

describe('resolveDefault', () => {
  let cat: any

  beforeEach(() => {
    cat = {
      default: 'code',
      order: {
        sort: 'human$',
        exclude: '',
        include: '',
      },
      item: {
        code: { title: 'Coding' },
        tech: { title: 'Technology' },
        devr: { title: 'Developer Relations' },
      },
    }
  })

  it('returns empty string when default is empty', () => {
    expect(resolveDefault(cat)).toEqual('code')
  })
})

describe('resolveCategories', () => {
  let cat: any

  beforeEach(() => {
    cat = {
      default: 'code',
      multiple: 1,
      order: {
        sort: 'human$',
        exclude: '',
        include: '',
      },
      item: {
        code: { title: 'Coding' },
        tech: { title: 'Technology' },
        devr: { title: 'Developer Relations' },
      },
    }
  })

  it('returns array of matched values when multiple is 1', () => {
    expect(resolveCategories(cat)).toEqual([
      { key: 'code', title: 'Coding' },
      { key: 'tech', title: 'Technology' },
      { key: 'devr', title: 'Developer Relations' },
    ])
  })
})
