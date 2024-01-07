
import React from 'react'

import { Gubu } from 'gubu'

import type { BasicProps, Spec } from './basic-types'




const CMPNAME = 'BasicLoading'
console.log(CMPNAME,'1')


// const { Exact } = Gubu
const BasicLoadingSpecShape = Gubu({
}, {prefix: CMPNAME})


function BasicLoading (props: BasicProps) {
  // TODO: use logo animation
  return (
    <div><h3>Loading...</h3></div>
  )
}


export {
  BasicLoading
}
