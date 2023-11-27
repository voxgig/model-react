import { useState, useEffect, useId } from 'react'
import { useSelector } from 'react-redux'
import { Link, useLocation, useParams } from 'react-router-dom'

import BasicList from './BasicList'
import BasicEdit from './BasicEdit'
import { Exact, Gubu } from 'gubu'
import { Box, Chip } from '@mui/material'

const { Skip } = Gubu

// Validate spec shape with Gubu
const BasicLedSpecShape = Gubu({
  title: String,
  name: String,
  paramId: Skip(String),
  content: {
    cmp: Skip(String),
    def: {
      canon: String,
      add: {
        active: Boolean
      },
      subview: {},
      id: Skip({
        field: String
      }),
      field: {},
      columnVisibility: Skip({})
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

  // Fetch data if not already fetched
  if ('none' === entstate) {
    let q = custom.BasicLed.query(basicLedSpec, cmpstate)
    seneca.entity(canon).list$(q)
  }

  const fields: any = basicLedSpec.content.def.field

  // Define columns
  // TODO: move to BasicList
  const basicListColumns = Object.entries(fields).map(
    ([key, field]: [any, any]) => ({
      accessorFn: (row: any) => row[key],
      accessorKey: key,
      header: field.label,
      enableEditing: field.editable,
      editVariant: field.inputType,
      editSelectOptions:
        'select' === field.inputType ? Object.keys(field.options) : null,
      Header: () => <span>{field.label}</span>,
      Cell: ({ cell, row }: any) => renderCell({ cell, field, row }),
      size: 40
    })
  )

  const viewName = basicLedSpec.name

  // Define how cells are rendered
  // TODO: move to BasicList
  const renderCell = ({ cell, field, row }: any) => {
    const cellValue = cell.getValue()
    var entityId, action

    switch (field.displayType) {
      case 'link':
        entityId = row.original.id
        return (
          <Link to={`/view/${viewName}/${entityId}/show`}>{cellValue}</Link>
        )
      case 'image':
        return <img src={cellValue} alt='Cell Content' />
      case 'action':
        entityId = row.original.id
        action = field.action
        return (
          <Link to={`/view/${viewName}/${entityId}/${action}`}>
            {field.actionLabel}
          </Link>
        )
      case 'chip':
        // TODO: refactor this to handle any color
        if (cellValue === 'Low') {
          return (
            <Chip sx={{ color: 'white' }} label={cellValue} color='success' />
          )
        } else if (cellValue === 'Med') {
          return (
            <Chip sx={{ color: 'white' }} label={cellValue} color='warning' />
          )
        } else if (cellValue === 'High') {
          return (
            <Chip sx={{ color: 'white' }} label={cellValue} color='error' />
          )
        }

      default:
        return <span>{cellValue}</span>
    }
  }

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

  // Grab head and foot components
  const headComponent = basicLedSpec.content.def?.subview?.index?.head?.cmp
  const footComponent = basicLedSpec.content.def?.subview?.index?.foot?.cmp
  const HeadCmp = ctx().cmp[headComponent]
  const FootCmp = ctx().cmp[footComponent]

  return (
    <Box className='BasicLed'>
      {'-/' + canon !== item.entity$ ? (
        <>
          {HeadCmp ? <HeadCmp /> : null}
          <BasicList
            key={canon}
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
          itemFields={fields}
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
