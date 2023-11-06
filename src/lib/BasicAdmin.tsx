import React from 'react'

import BasicHead from './BasicHead'
import BasicSide from './BasicSide'
import BasicMain from './BasicMain'
import BasicFoot from './BasicFoot'
import { Gubu } from 'gubu'

// spec schema definition with Gubu
const BasicAdminSpecShape = Gubu({
  frame: String
})

function BasicAdmin (props: any) {
  const { vxg, ctx } = props
  const model = ctx().model

  const basicAdminSpec = BasicAdminSpecShape(props.spec)

  const { frame } = basicAdminSpec
  const frameModel = model.app.web.frame[frame]

  const view = frameModel.view

  const headSpec = { head: frameModel.part.head, view }
  const sideSpec = { side: frameModel.part.side, view }
  const mainSpec = { main: frameModel.part.main, view }
  const footSpec = { foot: frameModel.part.foot, view }

  return (
    <div className='BasicAdmin'>
      <BasicHead vxg={vxg} ctx={ctx} spec={headSpec} />
      <BasicSide vxg={vxg} ctx={ctx} spec={sideSpec} />
      <BasicMain vxg={vxg} ctx={ctx} spec={mainSpec} />
      <BasicFoot vxg={vxg} ctx={ctx} spec={footSpec} />
    </div>
  )
}

export default BasicAdmin
