
import React from 'react'

import BasicHead from './BasicHead'
import BasicSide from './BasicSide'
import BasicMain from './BasicMain'
import BasicFoot from './BasicFoot'


function BasicAdmin(props: any) {
  const {
    vxg,
    ctx,
    spec
  } = props
  const model = ctx().model

  const { frame } = spec

  // spec schema definition with Gubu
  const shape = Gubu({
    frame: String
  })

  // spec schema validation with Gubu
  shape(spec)

  const frameModel = model.app.web.frame[frame]

  const headSpec: any = {
    head: frameModel.part.head,
    view: frameModel.view,
  }

  const sideSpec: any = {
    side: frameModel.part.side,
    view: frameModel.view,
  }

  const mainSpec: any = {
    main: frameModel.part.main,
    view: frameModel.view,
  }

  const footSpec: any = {
    foot: frameModel.part.foot,
    view: frameModel.view,
  }

  return (
    <div>
      <BasicHead vxg={vxg} ctx={ctx} spec={headSpec} />
      <BasicSide vxg={vxg} ctx={ctx} spec={sideSpec} />
      <BasicMain vxg={vxg} ctx={ctx} spec={mainSpec} />
      <BasicFoot vxg={vxg} ctx={ctx} spec={footSpec} />
    </div>
  )
}

export default BasicAdmin
