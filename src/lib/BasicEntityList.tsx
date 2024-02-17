

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

  useEffect(()=>{
    seneca.entity(canon).list$({slot$:slotName})
  },[])


  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'name',
      header: 'Name',
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
  
  /*
  const {
    ctx,
    onRowClick = () => {},
    onEditingRowSave = () => {},
    data,
    columns,
    sx = {},
    spec,
    isLoading,
    action
  } = props

  const theme = ctx().theme
  const editingMode = spec.content.def.subview[action]?.editingMode || 'none'
  const enableColumnFilters =
    spec.content.def.subview[action]?.enableColumnFilters || false
  const cmpKey = spec.content.key

  // callbacks for MaterialReactTable
  const handleSaveRow =
    async (args: any): Promise<void> => {
      let { exitEditingMode, row, values } = args
      onEditingRowSave(row, values)
      exitEditingMode()
    }

  const handleRowClick = ({ row }: { row: { id: string } }) => ({
    onClick: (event: any) => {
      let selitem = { ...data[Number(row.id)] }
      onRowClick(event, selitem)
    },
    sx: { cursor: 'pointer' }
  })

  const commonTableProps = {
    enableColumnActions: false,
    enableColumnFilters: enableColumnFilters,
    enableSorting: false,
    enableBottomToolbar: true,
    enableTopToolbar: false,
    columns: columns,
    data: data,
    initialState: {
      columnVisibility: spec.content.def.columnVisibility
    }
  }

  let specificProps = {}

  if (editingMode === 'row') {
    specificProps = {
      editingMode: 'row',
      enableEditing: true,
      enablePagination: true,
      onEditingRowSave: handleSaveRow
    }
  } else if (editingMode === 'form') {
    specificProps = {
      editingMode: 'custom',
      enablePagination: true,
      muiTableBodyRowProps: handleRowClick
    }
  } else {
    specificProps = {
      enablePagination: false
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box className='BasicList' style={{ ...sx }}>
        <MaterialReactTable
          {...commonTableProps}
          {...specificProps}
          state={{ isLoading: isLoading }}
          key={cmpKey}
        />
      </Box>
    </ThemeProvider>
  )
  */
}

export {
  BasicEntityList
}
