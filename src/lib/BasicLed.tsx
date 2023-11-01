import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
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
  const { ctx } = props
  const { seneca, custom } = ctx()
  const [item, setItem] = useState({} as any)
  const location = useLocation()

  const basicLedSpec = BasicLedSpecShape(props.spec)

  const def = basicLedSpec.content.def
  const canon = def.ent.canon

  const entlist = useSelector(
    (state: any) => state.main.vxg.ent.list.main[canon]
  )
  const rows = entlist

  const cmpstate = useSelector((state: any) => state.main.vxg.cmp)
  const entstate = useSelector(
    (state: any) => state.main.vxg.ent.meta.main[canon].state
  )
  if ('none' === entstate) {
    let q = custom.BasicLed.query(basicLedSpec, cmpstate)
    seneca.entity(canon).list$(q)
  }

  const itemFields: any = fields(basicLedSpec)

  const columns = itemFields.map((field: any) => ({
    accessorFn: (row: any) => row[field.name],
    accessorKey: field.name,
    header: field.headerName,
    enableEditing: field.edit,
    editVariant: 'status' === field.type ? 'select' : 'text',
    editSelectOptions: 'status' === field.type ? ['open', 'closed'] : null,
    Header: () => <span>{field.headerName}</span>,
    Cell: ({ cell }: any) => <span>{cell.getValue()}</span>
  }))

  let data = rows //.slice(0, 10)

  useEffect(() => {
    setItem({})
  }, [location.pathname])

  const vxgState = useSelector((state: any) => state.main.vxg)
  const led_add = vxgState.trigger.led.add
  let [triggerLed, setTriggerLed] = useState(0)

  // Triggered on add item button
  useEffect(() => {
    // a workaround to prevent
    // 'useEffect' to trigger when re-rendered
    if (triggerLed >= 2) {
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
