

import React, {
  useState,
  useEffect,
} from 'react'

import { useSelector } from 'react-redux'


// import {
  // useTheme,
  // createTheme,
  // ThemeProvider
// } from '@mui/material/styles'


import {
  MaterialReactTable,
  useMaterialReactTable,
  //  type MRT_ColumnDef,
} from 'material-react-table'

import { Box } from '@mui/material'


import { VxgBasicEntityListPlugin } from './VxgBasicEntityListPlugin'


const CMPNAME = 'BasicEntityList'


function BasicEntityList (props: any) {
  const { ctx } = props
  const { seneca } = ctx()

  const query = useSelector((state:any)=>state.main.current.view.query)
  
  const slotSelectors = seneca.export('Redux/slotSelectors')

  const [plugin, setPlugin] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(()=>{
    if(!plugin) {
      seneca.use({
        tag: props.spec.name,
        define: VxgBasicEntityListPlugin,
        options: {
          spec: props.spec,
          cell: {
            t_m: cellDateTime,
          },
          setPlugin,
        }
      })
    }
  },[])

  const { spec, slot, columns, buildFilter } =
    seneca.export('VxgBasicEntityListPlugin/handle') ||
    { spec: {}, columns: [] }

  const { ent, name } = spec

  if(plugin && !ready) {
    seneca.act('aim:app,on:BasicLed,ready:list',{view:name,setReady})
  }

  const { selectList } = slotSelectors(slot)
  const data = useSelector((state:any)=>selectList(state)) || []

  const { filter, filterDesc } = ready ? buildFilter(query) : {} as any

  useEffect(()=>{
    if( ready ) {
      seneca.entity(ent).list$({...(filter||{}),slot$:slot})
    }
  }, [filterDesc])


  const table = useMaterialReactTable({
    columns,
    data,

    enableTopToolbar: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,

    initialState: { density: 'compact' },
    
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        let entdata = row.original
        seneca.act('aim:app,on:BasicLed,edit:item', {
          view: name,
          item_id: entdata.id
        })
      },
      sx: {
        cursor: 'pointer',
      },
    }),
  })
  
  return (
    <Box className='vxg-BasicList'>
      <MaterialReactTable
        table={table}
      />
    </Box>
  )
}


function cellDateTime(spec: any) {
  const formattedDate = new Date(spec.cell.getValue()).toLocaleString()
  return <div>{formattedDate}</div>
}


export {
  BasicEntityList
}
