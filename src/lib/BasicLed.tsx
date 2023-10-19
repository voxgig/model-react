import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { useLocation } from 'react-router-dom'

import { MaterialReactTable } from 'material-react-table'

import BasicList from './BasicList'
import BasicEdit from './BasicEdit'
import { Gubu } from 'gubu'

function fields(spec: any) {

  try {
    let fds = []
    let fns = spec.content.def.edit.layout.order.replace(/\s+/g, '').split(/,/)
    for (let fn of fns) {
      let fd = { ...spec.content.def.ent.primary.field[fn] } || {}

      // fd.title = fd.title ? fd.title : fd.name
      fd.name = fn
      fd.headerName = fd.title
      fd = { ...fd, ...(spec.content.def.edit.layout.field[fn] || {}) }

      fds.push(fd)
    }

    return fds
  } catch (err) {
    // console.log(err)
  }
  catch (err) {
    // console.log(err)
  }

  return []
}

function BasicLed(props: any) {
  const {
    vxg,
    ctx,
    spec
  } = props

  // spec schema definition with Gubu
  const shape = Gubu({
    name: "",
    title: String,
    icon: String,
    content: { name: "", kind: String, def: { ent: {}, add: {}, edit: {} } },
  })

  // spec schema validation with Gubu
  shape(spec)

  const { model, seneca, custom } = ctx()

  const vxgState = useSelector((state: any) => state.main.vxg)

  const [item, setItem] = useState({} as any)

  const def = spec.content.def
  const { ent, cols } = def

  const canon = ent.canon

  const cmpstate = useSelector((state: any) => state.main.vxg.cmp)
  const entstate = useSelector((state: any) => state.main.vxg.ent.meta.main[canon].state)
  const entlist = useSelector((state: any) => state.main.vxg.ent.list.main[canon])

  const location = useLocation()

  // console.log('entlist',entlist)
  if ('none' === entstate) {
    let q = custom.BasicLed.query(spec, cmpstate)
    seneca.entity(canon).list$(q)
  }

  const rows = entlist

  const itemFields: any = fields(spec)

  const columns =
    itemFields.map((field: any) =>
    ({
      accessorFn: (row: any) => ('status' === field.type ? field.kind[row[field.name]]?.title : row[field.name]),
      accessorKey: field.name,
      header: field.headerName,
      Header: () => <span>{field.headerName}</span>,
      // muiTableHeadCellProps: { sx: { color: 'green' } },
      Cell: ({ cell }: any) => <span>{cell.getValue()}</span>,
    })
    )

  let data = rows //.slice(0, 10)

  useEffect(() => {
    setItem({})
  }, [location.pathname])

  const led_add = vxgState.trigger.led.add
  let [triggerLed, setTriggerLed] = useState(0)
  useEffect(() => {
    // a workaround to prevent
    // 'useEffect' to trigger when re-rendered
    if (triggerLed >= 2) {
      // setItem( { entity$: '-/' + def.ent } )
      setItem({ entity$: '-/' + def.ent.canon })
    }

    setTriggerLed(++triggerLed)
  }, [led_add])


  return (
    <div className="BasicLed">
      {
        '-/' + canon !== item.entity$ ?
          <BasicList
            ctx={ctx}
            spec={spec}
            data={data}
            columns={columns}
            onRowClick={(event: any, item: any) => {
              // console.log('item: ', item)
              setItem(item)
            }}
          /> :
          <BasicEdit
            ctx={ctx}
            spec={spec}
            onClose={() => {
              setItem({})
            }}
            onSubmit={async (item: any) => {
              await seneca.entity(canon).save$(item)
              setItem({})
            }}
            item={item}
            itemFields={itemFields}
          />
      }
    </div>
  )
}

export default BasicLed
