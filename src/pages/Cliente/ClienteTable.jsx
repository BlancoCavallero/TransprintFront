import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Search } from 'lucide-react';

export const ClienteTable = ({ columns, data }) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row, index) => String(row.idCliente || row.id || index), 
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  // Definimos un estilo común para las celdas para asegurar el padding
  const cellStyle = {
    paddingLeft: '20px',
    paddingRight: '20px',
    height: '55px', // Un poco más de altura para que no se vea apretado verticalmente
  };

  return (
    <div className="flex flex-col gap-[20px] w-full">
      <div style={{ padding: '0 20px' }} className="relative w-full">
        <Search 
          style={{ position: 'absolute', left: '32px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }} 
          className="h-4 w-4 text-muted-foreground" 
        />
        <Input
          placeholder="Buscar por nombre..."
          value={table.getColumn('nombreCompleto')?.getFilterValue() ?? ''}
          onChange={(e) => table.getColumn('nombreCompleto')?.setFilterValue(e.target.value)}
          style={{ paddingLeft: '45px', width: '100%' }}
        />
      </div>

      <div style={{ margin: '0 20px', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} style={cellStyle}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} style={cellStyle}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Sin resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div style={{ padding: '0 25px 20px 0', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
        <Button
          variant="outline"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          style={{ height: '40px', padding: '0 20px', border: '1px solid #cbd5e1' }}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          style={{ height: '40px', padding: '0 20px', border: '1px solid #cbd5e1' }}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
};