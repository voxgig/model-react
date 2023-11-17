import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import BasicList from './BasicList'
import BasicEdit from './BasicEdit'
import { Gubu, Skip } from 'gubu'
import { Box } from '@mui/material'

// Validate spec shape with Gubu
const BasicLedSpecShape = Gubu({
  name: String,
  content: {
    kind: String,
    editingMode: 'form',
    foot: {},
    head: {},
    cmp: Skip(String),
    def: {
      canon: String,
      field: Skip({}),
      add: {
        active: Boolean
      },
      id: Skip({
        field: String
      })
    }
  }
})

function BasicLed (props: any) {
  const { ctx } = props
  const { seneca, custom } = ctx()
  const [item, setItem] = useState({} as any)
  const location = useLocation()

  const basicLedSpec = BasicLedSpecShape(props.spec)

  const def = basicLedSpec.content.def
  const canon = def.canon

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

  const basicEditFields: any = basicLedSpec.content.def.field

  const basicListColumns = Object.entries(basicEditFields).map(
    ([key, field]: [any, any]) => ({
      accessorFn: (row: any) => row[key],
      accessorKey: key,
      header: field.label,
      enableEditing: field.editable,
      editVariant: field.inputType,
      editSelectOptions:
        'select' === field.inputType ? Object.keys(field.options) : null,
      Header: () => <span>{field.label}</span>,
      Cell: ({ cell }: any) => <span>{cell.getValue()}</span>
    })
  )

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
      setItem({ entity$: '-/' + def.canon })
    }

    setTriggerLed(++triggerLed)
  }, [led_add])

  const headCmpId = basicLedSpec.content.head?.cmp
  const footCmpId = basicLedSpec.content.foot?.cmp
  const HeadCmp = ctx().cmp[headCmpId]
  const FootCmp = ctx().cmp[footCmpId]

  return (
    <Box className='BasicLed'>
      {'-/' + canon !== item.entity$ ? (
        <>
          {HeadCmp ? <HeadCmp /> : null}
          <BasicList
            ctx={ctx}
            spec={basicLedSpec}
            data={data || []}
            columns={basicListColumns}
            onRowClick={(event: any, item: any) => {
              console.log('item: ', item)
              setItem(item)
            }}
            onEditingRowSave={async (row: any, values: any) => {
              let selectedItem = { ...data[row.index] }
              for (let k in values) {
                selectedItem[k] = values[k]
              }
              await seneca.entity(canon).save$(selectedItem)
              setItem({})
            }}
          />
          {FootCmp ? <FootCmp /> : null}
        </>
      ) : (
        <BasicEdit
          ctx={ctx}
          spec={basicLedSpec}
          item={item}
          itemFields={basicEditFields}
          onClose={() => {
            setItem({})
          }}
          onSubmit={async (item: any) => {
            await seneca.entity(canon).save$(item)
            setItem({})
          }}
        />
      )}
    </Box>
  )
}

export default BasicLed
