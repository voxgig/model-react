import { useMemo } from 'react'
import { useTheme, createTheme, ThemeProvider } from '@mui/material/styles'

import {
  MaterialReactTable,
  type MaterialReactTableProps,
  type MRT_ColumnDef
} from 'material-react-table'
import { Box } from '@mui/material'

// import { DataGrid } from '@mui/x-data-grid'

function BasicList (props: any) {
  const {
    ctx,
    onRowClick = () => {},
    onEditingRowSave = () => {},
    data,
    columns,
    sx = {},
    spec
  } = props

  const theme = ctx().theme
  const editingMode = spec.content.def.subview.index.editingMode
  const cmpKey = spec.content.key

  // callbacks for MaterialReactTable
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

  const commonTableProps = {
    enableColumnActions: false,
    enableColumnFilters: false,
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
          key={cmpKey}
        />
      </Box>
    </ThemeProvider>
  )
}

export default BasicList
