import { describe, it, expect, beforeEach } from 'vitest'

import { resolveCategories, resolveDefault, resolveValue } from '../src/lib/BasicEntityAutocompleteField'

describe('resolveValue', () => {
  let value: any
  let cat: any

  beforeEach(() => {
    value = 'code,tech'
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

  it('returns empty string for unmatched values when multiple is 1', () => {
    value = 'foo,bar'
    expect(resolveValue(value, cat)).toEqual('')
  })

  it('returns object of matched values when multiple is 1', () => {
    cat.multiple = 1
    expect(resolveValue(value, cat)).toEqual({ key: 'code', title: 'Coding' })
  })

  it('returns empty array for unmatched values when multiple is 2', () => {
    value = 'foo,bar'
    cat.multiple = 2
    expect(resolveValue(value, cat)).toEqual([])
  })

  it('returns empty array for unmatched values when multiple is 2', () => {
    value = 'foo'
    cat.multiple = 2
    expect(resolveValue(value, cat)).toEqual([])
  })

  it('returns array of matched values when multiple is 2', () => {
    cat.multiple = 2
    expect(resolveValue(value, cat)).toEqual([
      { key: 'code', title: 'Coding' },
      { key: 'tech', title: 'Technology' },
    ])
  })

  it('returns empty array for unmatched values when multiple is -1', () => {
    value = 'foo,bar'
    cat.multiple = -1
    expect(resolveValue(value, cat)).toEqual([])
  })

  it('returns array of matched values when multiple is -1', () => {
    cat.multiple = -1
    expect(resolveValue(value, cat)).toEqual([
      { key: 'code', title: 'Coding' },
      { key: 'tech', title: 'Technology' },
    ])
  })
})

describe('resolveDefault', () => {
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

  it('returns object of matched values when multiple is 1', () => {
    expect(resolveDefault(cat)).toEqual({ key: 'code', title: 'Coding' })
  })

  it('returns object of matched value when multiple is 1', () => {
    cat.default = 'code,tech,devr'
    expect(resolveDefault(cat)).toEqual({ key: 'code', title: 'Coding' })
  })

  it('returns empty string when item is empty and multiple is 1', () => {
    cat.default = 'code,tech,devr'
    cat.item = {}
    expect(resolveDefault(cat)).toEqual('')
  })

  it('returns array of matched values when multiple is 2', () => {
    cat.default = 'code,tech,devr'
    cat.multiple = 2
    expect(resolveDefault(cat)).toEqual([
      { key: 'code', title: 'Coding' },
      { key: 'tech', title: 'Technology' },
    ])
  })

  it('returns empty array when item is empty and multiple is 2', () => {
    cat.default = 'code,tech,devr'
    cat.item = {}
    cat.multiple = 2
    expect(resolveDefault(cat)).toEqual([])
  })

  it('returns empty array when item is empty and multiple is -1', () => {
    cat.multiple = -1
    expect(resolveDefault(cat)).toEqual([{ key: 'code', title: 'Coding' }])
  })

  it('returns empty array when item is empty and multiple is -1', () => {
    cat.multiple = -1
    cat.default = 'code,tech,devr'
    expect(resolveDefault(cat)).toEqual([
      { key: 'code', title: 'Coding' },
      { key: 'tech', title: 'Technology' },
      { key: 'devr', title: 'Developer Relations' },
    ])
  })

  it('returns empty array when item is empty and multiple is -1', () => {
    cat.default = 'code,tech,devr'
    cat.item = {}
    cat.multiple = -1
    expect(resolveDefault(cat)).toEqual([])
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
