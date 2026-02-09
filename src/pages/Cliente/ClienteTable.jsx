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
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row) => String(row.idCliente || row.id),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="flex flex-col gap-[20px] justify-center w-full">
      {/* 1. Buscador */}
      <div style={{ paddingLeft: '20px', paddingRight: '20px' }} className="flex items-center justify-between w-full">
        <div className="relative w-full flex items-center">
          <Search 
            style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              zIndex: 10 
            }} 
            className="h-4 w-4 text-muted-foreground" 
          />
          
          <Input
            placeholder="Buscar por nombre, email o empresa..."
            value={table.getColumn('nombreCompleto')?.getFilterValue() ?? ''}
            onChange={(event) =>
              table.getColumn('nombreCompleto')?.setFilterValue(event.target.value)
            }
            style={{ paddingLeft: '45px', width: '100%' }}
            className="w-full"
          />
        </div>
      </div>

      {/* 2. Tabla */}
      <div 
        style={{ padding: '20px' }} 
        className="rounded-md border"
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 3. Paginación: Corregida con padding forzado */}
      <div 
        style={{ paddingRight: '25px', paddingBottom: '25px' }} 
        className="flex items-center justify-end"
      >
        <div style={{ display: 'flex', gap: '15px' }}> {/* Espacio entre botones */}
          <Button
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            style={{ 
              height: '40px', 
              paddingLeft: '20px', 
              paddingRight: '20px',
              border: '1px solid #cbd5e1', // Borde visible igual que "Actualizar"
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            className="transition-all active:scale-95 shadow-sm"
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            style={{ 
              height: '40px', 
              paddingLeft: '20px', 
              paddingRight: '20px',
              border: '1px solid #cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            className="transition-all active:scale-95 shadow-sm"
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
};