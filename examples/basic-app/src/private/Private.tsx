import React from 'react'

import { useSelector } from 'react-redux'

import { BasicAdmin } from '@voxgig/model-react'

import { getMain } from '../setup'
import Chat from './Chat'

const main = getMain()

// Provided as a function to prevent deep inspection.
const ctx = () => ({
  model: main.model,
  seneca: main.seneca,
  store: main.store,
  cmp: {
    chat: Chat
  },
  custom: {
    BasicLed: {
      query: (view: any, cmpstate: any) => {}
    }
  }
})

const spec = {
  frame: 'private'
}

function Private (props: any) {
  return (
    <div className='Private'>
      <BasicAdmin ctx={ctx} spec={spec} />
    </div>
  )
}

export default Private
