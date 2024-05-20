

import React, {
  useEffect,
} from 'react'

import { useSelector } from 'react-redux'


import {
  // useTheme,
  // createTheme,
  ThemeProvider
} from '@mui/material/styles'


import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table'

import { Box } from '@mui/material'

import type { Spec } from './basic-types'

import { Gubu } from 'gubu'


const CMPNAME = 'BasicEntityList'
console.log(CMPNAME,'1')


const { Open } = Gubu
const BasicEntityListSpecShape = Gubu(Open({
}), {prefix: CMPNAME})


function BasicEntityList (props: any) {
  const { ctx, spec } = props
  const { seneca, model } = ctx()

  const basicEntityListSpec: Spec = BasicEntityListSpecShape(spec)
  console.log(CMPNAME,basicEntityListSpec)

  const name = spec.name
  const slotName = spec.prefix+spec.name
  const canon = spec.ent
  
  const slotSelectors = seneca.export('Redux/slotSelectors')
  let { selectItem, selectList, selectMeta } = slotSelectors(slotName)

  let data = useSelector((state:any)=>selectList(state))

  let query = useSelector((state:any)=>state.main.current.view.query)

  let filter = Object.entries(query)
  .reduce((a:any,n)=>((n[0].startsWith('f_')?a[n[0].substring(2)]=n[1]:null),a),{})

  console.log('QF', query, filter)

  
  useEffect(()=>{
    const q = {...filter,slot$:slotName}
    console.log('LIST', canon, q)
    seneca.entity(canon).list$(q)
  },Object.values(filter))


  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'title',
      header: 'Title',
    },
  ]

  
  const table = useMaterialReactTable({
    columns,
    data,

    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        let entdata = row.original
        console.info('ROW', entdata)
        seneca.act('aim:app,on:view,edit:item', {
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

export {
  BasicEntityList
}
