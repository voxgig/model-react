import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { useLocation } from 'react-router-dom'

import { MaterialReactTable } from 'material-react-table'

import BasicList from './BasicList'
import BasicEdit from './BasicEdit'
import { Gubu } from 'gubu'

function fields (spec: any) {
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

  return []
}

// Validate spec shape with Gubu
const BasicLedSpecShape = Gubu({
  name: '',
  title: String,
  icon: String,
  content: { name: '', kind: String, def: { ent: {}, add: {}, edit: {} } }
})

function BasicLed (props: any) {
  const { vxg, ctx } = props

  const basicLedSpec = BasicLedSpecShape(props.spec)

  const { seneca, custom } = ctx()

  const vxgState = useSelector((state: any) => state.main.vxg)

  const [item, setItem] = useState({} as any)
  // console.log('item: ', item)

  const def = basicLedSpec.content.def
  const { ent, cols } = def

  const canon = ent.canon

  const cmpstate = useSelector((state: any) => state.main.vxg.cmp)
  const entstate = useSelector(
    (state: any) => state.main.vxg.ent.meta.main[canon].state
  )
  const entlist = useSelector(
    (state: any) => state.main.vxg.ent.list.main[canon]
  )

  const location = useLocation()

  // console.log('entlist',entlist)
  if ('none' === entstate) {
    let q = custom.BasicLed.query(basicLedSpec, cmpstate)
    seneca.entity(canon).list$(q)
  }

  const rows = entlist

  const itemFields: any = fields(basicLedSpec)
  // console.log('itemFields: ', itemFields)

  const columns = itemFields.map((field: any) => ({
    // accessorFn: (row: any) => ('status' === field.type ? field.kind[row[field.name]]?.title : row[field.name]),
    accessorFn: (row: any) => row[field.name],
    accessorKey: field.name,
    header: field.headerName,
    enableEditing: field.edit,
    editVariant: 'status' === field.type ? 'select' : 'text',
    editSelectOptions: 'status' === field.type ? ['open', 'closed'] : null,
    Header: () => <span>{field.headerName}</span>,
    // muiTableHeadCellProps: { sx: { color: 'green' } },
    Cell: ({ cell }: any) => <span>{cell.getValue()}</span>
  }))
  // console.log('columns: ', columns)

  let data = rows //.slice(0, 10)
  // console.log('data: ', data)

  useEffect(() => {
    setItem({})
  }, [location.pathname])

  const led_add = vxgState.trigger.led.add
  let [triggerLed, setTriggerLed] = useState(0)

  // Triggered on add item button
  useEffect(() => {
    // a workaround to prevent
    // 'useEffect' to trigger when re-rendered
    if (triggerLed >= 2) {
      // setItem( { entity$: '-/' + def.ent } )
      // console.log('led_add: ', led_add)
      setItem({ entity$: '-/' + def.ent.canon })
    }

    setTriggerLed(++triggerLed)
  }, [led_add])

  return (
    <div className='BasicLed'>
      {'-/' + canon !== item.entity$ ? (
        <BasicList
          ctx={ctx}
          spec={basicLedSpec}
          data={data}
          columns={columns}
          // onRowClick={(event: any, item: any) => {
          //   console.log('item: ', item)
          //   setItem(item)
          // }}
          onEditingRowSave={async (row: any, values: any) => {
            let selectedItem = { ...data[row.index] }
            for (let k in values) {
              selectedItem[k] = values[k]
            }
            console.log('selectedItem: ', selectedItem)
            await seneca.entity(canon).save$(selectedItem)
            setItem({})
          }}
        />
      ) : (
        <BasicEdit
          ctx={ctx}
          spec={basicLedSpec}
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
      )}
    </div>
  )
}

export default BasicLed
