

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
  // type MRT_ColumnDef
} from 'material-react-table'

import { Box } from '@mui/material'

// import { DataGrid } from '@mui/x-data-grid'



function BasicList (props: any) {
  const { ctx, spec } = props
  const { seneca, model } = ctx()

  const slotName = spec.prefix+spec.name
  const canon = spec.ent
  
  const slotSelectors = seneca.export('Redux/slotSelectors')
  let { selectItem, selectList, selectMeta } = slotSelectors(slotName)

  let list = useSelector((state:any)=>selectList(state))

  useEffect(()=>{
    seneca.entity(canon).list$({slot$:slotName})
  },[])
  
  return (
    <Box className='vxg-BasicList'>
      <h3>BasicList</h3>

      { list.map((item:any, index:number)=>
        <p key={item.id}>{index} {JSON.stringify(item)}</p>
      )}
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
  BasicList
}
