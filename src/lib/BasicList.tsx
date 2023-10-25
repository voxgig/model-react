import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

import {
  MaterialReactTable,
  MaterialReactTableProps,
  MRT_ColumnDef
} from 'material-react-table'

// import { DataGrid } from '@mui/x-data-grid'

function BasicList (props: any) {
  let {
    onRowClick = () => {},
    onEditingRowSave = () => {},
    data,
    columns,
    sx = {}
  } = props

  const { ctx, spec } = props
  const { model, seneca, custom } = ctx()

  const vxg = useSelector((state: any) => state.main.vxg)

  const handleSaveRow: MaterialReactTableProps<
    any
  >['onEditingRowSave'] = async ({
    exitEditingMode,
    row,
    values
  }): Promise<void> => {
    onEditingRowSave(row, values)
    exitEditingMode() //required to exit editing mode
  }

  return (
    <div className='BasicList' style={{ ...sx }}>
      <MaterialReactTable
        enableColumnActions={false}
        enableColumnFilters={false}
        enablePagination
        enableSorting={false}
        enableBottomToolbar
        enableTopToolbar={false}
        editingMode='row'
        enableEditing
        columns={columns}
        data={data}
        onEditingRowSave={handleSaveRow}
        muiTableBodyRowProps={({ row }) => ({
          // onClick: (event: any) => {
          //   let selitem = { ...data[Number(row.id)] }
          //   onRowClick(event, selitem)
          // },
          sx: { cursor: 'pointer' }
        })}
      />
    </div>
  )
}

export default BasicList

/*
  <DataGrid
    rows={rows}
    columns={cols}
    onRowClick={ (params) => {
      let selitem = { ...params.row }
      // console.log('item: ', selitem)
      onRowClick({}, selitem)
      
    }}

    checkboxSelection={false}
  />
*/
