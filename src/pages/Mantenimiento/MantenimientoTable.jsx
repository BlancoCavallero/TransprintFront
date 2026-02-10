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
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

export const MantenimientoTable = ({ columns, data }) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  // Estilo de celda idéntico a ClienteTable
  const cellStyle = {
    paddingLeft: '20px',
    paddingRight: '20px',
    height: '55px',
  };

  return (
    <div className="flex flex-col gap-[20px] w-full">
      {/* Buscador con estilo adaptado */}
      <div style={{ padding: '0 20px' }} className="relative w-full">
        <Search 
          style={{ position: 'absolute', left: '32px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }} 
          className="h-4 w-4 text-muted-foreground" 
        />
        <Input
          placeholder="Filtrar por patente..."
          value={table.getColumn('tipo')?.getFilterValue() ?? ''}
          onChange={(event) =>
            table.getColumn('tipo')?.setFilterValue(event.target.value)
          }
          style={{ paddingLeft: '45px', width: '100%' }}
        />
      </div>

      {/* Contenedor de tabla con bordes y radio */}
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
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación con chevrons (solo si hay más de 1 página) */}
      {table.getPageCount() > 1 && (
        <div style={{ padding: '0 20px 20px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
          <div className="text-sm text-muted-foreground mr-4">
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              style={{ height: '36px', width: '36px', padding: '0', border: '1px solid #cbd5e1' }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              style={{ height: '36px', width: '36px', padding: '0', border: '1px solid #cbd5e1' }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};