import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import {
  MaterialReactTable,
  type MaterialReactTableProps,
  type MRT_ColumnDef
} from 'material-react-table'
import { Box } from '@mui/material'

// import { DataGrid } from '@mui/x-data-grid'

function BasicList (props: any) {
  let {
    onRowClick = () => {},
    onEditingRowSave = () => {},
    data,
    columns,
    sx = {},
    spec
  } = props

  const handleSaveRow: MaterialReactTableProps<any>['onEditingRowSave'] =
    async ({ exitEditingMode, row, values }): Promise<void> => {
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

  console.log('BasicList.spec: ', spec)
  const editingMode = spec.content.editingMode
  const enableEditing = spec.content.editingMode === 'inline'
  const editingRowSave = enableEditing ? handleSaveRow : undefined

  return (
    <Box className='BasicList' style={{ ...sx }}>
      <MaterialReactTable
        enableColumnActions={false}
        enableColumnFilters={false}
        enablePagination
        enableSorting={false}
        enableBottomToolbar
        enableTopToolbar={false}
        editingMode={editingMode}
        enableEditing={enableEditing}
        columns={columns}
        data={data}
        onEditingRowSave={editingRowSave}
        muiTableBodyRowProps={handleRowClick}
      />
    </Box>
  )
}

export default BasicList
