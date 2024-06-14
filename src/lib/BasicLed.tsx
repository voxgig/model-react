import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import BasicList from './BasicList'
import BasicEdit from './BasicEdit'
import { Gubu } from 'gubu'
import { Box, Chip, LinearProgress, Typography } from '@mui/material'
import BasicButton from './BasicButton'
import Dinero from 'dinero.js'

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
function BasicLed(props: any) {
  const { ctx, action } = props
  const { seneca, custom } = ctx()
  const [item, setItem] = useState({} as any)
  const location = useLocation()
  const navigate = useNavigate()
  const [data, setData] = useState([] as any)
  const [isLoading, setIsLoading] = useState(false)
  let [triggerLed, setTriggerLed] = useState(0)

  // define variables from spec
  const basicLedSpec = BasicLedSpecShape(props.spec)
  const viewName = basicLedSpec.name
  const def = basicLedSpec.content.def
  const canon = def.canon
  const fields: any = basicLedSpec.content.def.field

  const cmpState = useSelector((state: any) => state.main.vxg.cmp)

  // Move the useSelector hook to the top level of your component
  const entState = useSelector(
    (state: any) => state.main.vxg.ent.meta.main[canon].state
  )

  // Define data we'll use to render the list
  const entlist = useSelector(
    (state: any) => state.main.vxg.ent.list.main[canon]
  )

  // Handle when the add button (in BasicHead) is clicked
  const led_add = useSelector((state: any) => state.main.vxg.trigger.led.add)
  // const vxgState = useSelector((state: any) => state.main.vxg)
  // const led_add = vxgState.trigger.led.add

  useEffect(() => {
    setIsLoading(true)
    // console.log('[]setIsLoading(true)')
  }, [])

  useEffect(() => {
    if ('none' === entState) {
      setIsLoading(true)
      // console.log('[...]setIsLoading(true)')
      let q = custom.BasicLed.query(basicLedSpec, cmpState)
      //seneca.entity(canon).list$(q)
    }
  }, [entState])

  useEffect(() => {
    if ('loaded' === entState) {
      setIsLoading(false)
      if ('fox/bom' === canon) {
        const filters = cmpState.AssignSuppliersHead.filters
        const supplierId = filters.supplier.selected
        const ceid = filters.ceid.selected
        const toolId = filters.tool.selected
        const startDate = filters.prefacStart.selected
        const endDate = filters.prefacEnd.selected
        const unallocatedOnly = filters.unallocated.selected
        const currentProject = cmpState.BasicHead.tool.project.selected

        const filteredData = entlist.filter((item: any) => {
          const isSupplierMatch =
            supplierId === '' || item.suppliers.includes(supplierId)
          const isCEIDMatch = ceid === '' || item.ceids.includes(ceid)
          const isToolIdMatch = toolId === '' || item.tools.includes(toolId)
          const isDateRangeMatch =
            (startDate === '' || item.earlirestPrefac >= startDate) &&
            (endDate === '' || item.earlirestPrefac <= endDate)
          const isUnallocatedMatch = !unallocatedOnly || item.qtyasn < 100
          const isProjectMatch = currentProject === item.project_id
          return (
            isSupplierMatch &&
            isCEIDMatch &&
            isToolIdMatch &&
            isDateRangeMatch &&
            isUnallocatedMatch &&
            isProjectMatch
          )
        })

        setData(filteredData)
      } else {
        setData(entlist)
      }
    }
  }, [entState, entlist, cmpState])

  // Reset item when location changes
  useEffect(() => {
    setItem({})
  }, [location.pathname])

  // Reset item when led_add changes
  useEffect(() => {
    // a workaround to prevent 'useEffect' to trigger when re-rendered
    if (triggerLed >= 2) {
      setItem({ entity$: '-/' + def.canon })
    }

    setTriggerLed(++triggerLed)
  }, [led_add])

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
          <Typography variant='body2' fontWeight='bold'>
            {field.label}
          </Typography>
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
    let entityId: any, action, textAlign

    switch (field.displayType) {
      case 'link':
        const target = field.target
        entityId = row.original[target?.idName || 'id']
        const entityName = target?.entity || viewName

        return (
          <Link to={`/view/${entityName}/${entityId}/show`}>
            <Typography variant='body2' textTransform='capitalize'>
              {cellValue}
            </Typography>
          </Link>
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
        const approveButton = ctx().cmp[field.action]
        return approveButton({
          field: field,
          row: row,
          data: data,
          seneca: seneca
        })
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
        // TODO: Accept dynamic width, border, height, etc.

        const suppliersNumber = row.original.suppliers?.length || 0

        // divide cellValue by suppliersNumber and cap it at 100
        let progressValue = 0
        if (suppliersNumber > 0) {
          const rawValue = cellValue / suppliersNumber
          progressValue = rawValue > 100 ? 100 : rawValue
        }

        return (
          <LinearProgress
            variant='determinate'
            value={progressValue}
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
          const valueCurrency = Number(cellValue)
          const dineroObject = Dinero({
            amount: Math.round(valueCurrency * 100),
            currency: 'EUR'
          })
          const formattedValue = dineroObject.toFormat('$0,0.00')
          return (
            <Box sx={{ textAlign: textAlign }}>
              <Typography variant='body2'>{formattedValue}</Typography>
            </Box>
          )
        }
      case 'number':
        textAlign = field.textAlign || 'right'
        const valueNumber = Number(cellValue)
        // handle NaN case
        if (isNaN(valueNumber)) {
          return <Box sx={{ textAlign: textAlign }}>{field.defaultValue}</Box>
        }

        return (
          <Box
            display='flex'
            justifyContent='flex-end'
            width='100%'
            sx={{
              textAlign: textAlign
            }}
          >
            <Typography variant='body2'>
              {valueNumber.toLocaleString()}
            </Typography>
          </Box>
        )
      case 'percentage':
        return (
          <Box
            display='flex'
            justifyContent='flex-end'
            sx={{
              textAlign: 'right'
            }}
          >
            <Typography variant='body2'>{cellValue}%</Typography>
          </Box>
        )
      case 't_c':
        if (!cellValue) {
          return <Box sx={{ textAlign: 'left' }}>-</Box>
        }
        const date = new Date(cellValue)
        if (isNaN(date.getTime())) {
          return <Box sx={{ textAlign: 'left' }}>Invalid date</Box>
        }
        const dateStr = date.toISOString()
        return <Box sx={{ textAlign: 'left' }}>{dateStr}</Box>
      default:
        textAlign = field.textAlign || 'left'
        return (
          <Box sx={{ textAlign: textAlign }}>
            <Typography variant='body2'>{cellValue}</Typography>
          </Box>
        )
    }
  }

  // Define names of custom header and footer components
  const currentSubview = basicLedSpec.content.def?.subview[action]
  const headComponent = currentSubview?.head?.cmp
  const footComponent = currentSubview?.foot?.cmp

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
            isLoading={isLoading}
            action={action}
            onRowClick={(event: any, item: any) => {
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
