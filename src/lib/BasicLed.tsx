import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import BasicList from './BasicList'
import BasicEdit from './BasicEdit'
import { Gubu, Open } from 'gubu'

// Validate spec shape with Gubu
const BasicLedSpecShape = Gubu(
  Open({
    name: '',
    content: {
      name: '',
      kind: String,
      def: {
        canon: String,
        fields: {},
        ent: {},
        add: {},
        edit: {}
      }
    }
  })
)

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

  const basicEditFields: any = basicLedSpec.content.def.fields

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

  return (
    <div className='BasicLed'>
      {'-/' + canon !== item.entity$ ? (
        <BasicList
          ctx={ctx}
          spec={basicLedSpec}
          data={data}
          columns={basicListColumns}
          onEditingRowSave={async (row: any, values: any) => {
            let selectedItem = { ...data[row.index] }
            for (let k in values) {
              selectedItem[k] = values[k]
            }
            await seneca.entity(canon).save$(selectedItem)
            setItem({})
          }}
        />
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
    </div>
  )
}

export default BasicLed
