import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import BasicList from './BasicList'
import BasicEdit from './BasicEdit'
import { Gubu } from 'gubu'
import { Box, Chip, LinearProgress, Typography } from '@mui/material'
import BasicButton from './BasicButton'

// Define the shape of props.spec
const { Skip } = Gubu
const BasicLedSpecShape = Gubu({
  title: String,
  name: String,
  paramId: Skip(String),
  content: {
    cmp: Skip(String),
    def: {
      canon: String,
      add: Skip({
        active: Boolean
      }),
      subview: {},
      id: Skip({
        field: String
      }),
      field: {},
      columnVisibility: Skip({})
    }
  }
})

// BasicLed renders a list of entities (with BasicList) or a form to edit them (with BasicEdit)
function BasicLed (props: any) {
  const { ctx, action } = props
  const { seneca, custom } = ctx()
  const [item, setItem] = useState({} as any)
  const location = useLocation()
  const navigate = useNavigate()

  // Validate props.spec shape
  const basicLedSpec = BasicLedSpecShape(props.spec)

  console.log('spec: ', basicLedSpec)

  // Define few variables from spec
  const viewName = basicLedSpec.name
  const def = basicLedSpec.content.def
  const canon = def.canon

  // Fetch entity data if not already fetched
  const cmpState = useSelector((state: any) => state.main.vxg.cmp)
  const entState = useSelector(
    (state: any) => state.main.vxg.ent.meta.main[canon].state
  )
  if ('none' === entState) {
    let q = custom.BasicLed.query(basicLedSpec, cmpState)
    seneca.entity(canon).list$(q)
  }

  // --------------------------------------------------
  // Common
  // --------------------------------------------------

  // Define entity fields from spec
  const fields: any = basicLedSpec.content.def.field

  console.log('fields: ', fields)

  // --------------------------------------------------
  // BasicList related
  // --------------------------------------------------

  // Define data we'll use to render the list
  const entlist = useSelector(
    (state: any) => state.main.vxg.ent.list.main[canon]
  )
  const rows = entlist
  let data = rows //.slice(0, 10)

  console.log('data: ', data)

  // TODO: move to BasicList
  // Define BasicList columns from fields
  const basicListColumns = Object.entries(fields).map(
    ([key, field]: [any, any]) => ({
      accessorFn: (row: any) => row[key],
      accessorKey: key,
      header: field.label,
      enableEditing: field.editable,
      editVariant: field.inputType,
      editSelectOptions:
        'select' === field.inputType ? Object.keys(field.options) : null,
      Header: () => (
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            justifyContent: field.headerAlign || 'left'
          }}
        >
          {field.label}
        </Box>
      ),
      Cell: ({ cell, row }: any) => renderCell({ cell, field, row }),
      size: field.size || 40
    })
  )

  // TODO: move to BasicList
  // Define how cells are rendered
  const renderCell = ({ cell, field, row }: any) => {
    const cellValue = cell.getValue()
    let entityId, action, textAlign

    switch (field.displayType) {
      case 'link':
        const target = field.target
        entityId = row.original[target?.idName || 'id']
        const entityName = target?.entity || viewName

        return (
          <Link to={`/view/${entityName}/${entityId}/show`}>{cellValue}</Link>
        )
      case 'image':
        return <img src={cellValue} alt='Cell Content' />
      case 'navbutton':
        return (
          <BasicButton
            type='submit'
            variant='outlined'
            size='medium'
            onClick={() => {
              navigate(`/view/${viewName}/${row.original.id}/${field.action}`)
            }}
          >
            {field.actionLabel}
          </BasicButton>
        )
      // TODO: merge this case with 'navbutton'
      case 'button':
        if (field.action === 'approve') {
          return (
            <BasicButton
              type='submit'
              variant='outlined'
              size='medium'
              onClick={() => {
                console.log('approve')
              }}
            >
              {field.actionLabel}
            </BasicButton>
          )
        } else {
          return (
            <Box
              sx={{
                display: 'flex',
                justifyContent: field.justifyContent || 'center'
              }}
            >
              <BasicButton type='submit' variant='outlined' size='medium'>
                {field.actionLabel}
              </BasicButton>
            </Box>
          )
        }
      // TODO: remove this case
      case 'action':
        entityId = row.original.id
        action = field.action
        return (
          <Link to={`/view/${viewName}/${entityId}/${action}`}>
            {field.actionLabel}
          </Link>
        )
      case 'chip':
        // FIXME: refactor this to handle any color
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
      case 'progressBar':
        // FIXME: Accept dynamic width, border, height, etc.
        return (
          <LinearProgress
            variant='determinate'
            value={cellValue}
            color='success'
            sx={{ height: '9px', border: '2px solid #ccc', width: '80%' }}
          />
        )
      case 'currency':
        // TODO: apply currency symbol
        const currency = field.currency || 'EUR'
        textAlign = field.textAlign || 'right'
        // check if cellValue is a number
        if (isNaN(cellValue)) {
          return <Box sx={{ textAlign: textAlign }}>{field.defaultValue}</Box>
        } else {
          const valueCurrency = Number(cellValue).toLocaleString()
          return <Box sx={{ textAlign: textAlign }}>€{valueCurrency}</Box>
        }
      case 'number':
        textAlign = field.textAlign || 'right'
        const valueNumber = Number(cellValue)
        return (
          // <Box sx={{ textAlign: textAlign, backgroundColor: 'red' }}>
          //   {valueNumber.toLocaleString()}
          // </Box>
          <Box
            display='flex'
            justifyContent='flex-end'
            width='100%'
            sx={{
              // backgroundColor: 'red',
              textAlign: textAlign
            }}
          >
            <Typography variant='body1'>
              {valueNumber.toLocaleString()}
            </Typography>
          </Box>
        )
      default:
        textAlign = field.textAlign || 'left'
        return <Box sx={{ textAlign: textAlign }}>{cellValue}</Box>
    }
  }

  // --------------------------------------------------
  // BasicEdit related
  // --------------------------------------------------

  // Reset item when location changes
  useEffect(() => {
    setItem({})
  }, [location.pathname])

  // Handle when the add button (in BasicHead) is clicked
  const vxgState = useSelector((state: any) => state.main.vxg)
  const led_add = vxgState.trigger.led.add
  let [triggerLed, setTriggerLed] = useState(0)
  useEffect(() => {
    // a workaround to prevent 'useEffect' to trigger when re-rendered
    if (triggerLed >= 2) {
      setItem({ entity$: '-/' + def.canon })
    }

    setTriggerLed(++triggerLed)
  }, [led_add])

  //
  // Component rendering
  //

  // Define names of custom header and footer components
  const currentSubview = basicLedSpec.content.def?.subview[action]
  const headComponent = currentSubview.head?.cmp
  const footComponent = currentSubview.foot?.cmp

  // Grab custom header and footer from ctx
  const HeadCmp = ctx().cmp[headComponent]
  const FootCmp = ctx().cmp[footComponent]

  // Render BasicLed (list entities) or BasicEdit (edit single entity) depending on item.entity$
  return (
    <Box className='BasicLed'>
      {'-/' + canon !== item.entity$ ? (
        <>
          {HeadCmp ? <HeadCmp ctx={ctx} /> : null}
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
          {FootCmp ? <FootCmp ctx={ctx} /> : null}
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
