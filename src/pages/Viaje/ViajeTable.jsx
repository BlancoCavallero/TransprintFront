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

export const ViajeTable = ({ columns, data }) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const table = useReactTable({
    data,
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

  const cellStyle = {
    paddingLeft: '16px',
    paddingRight: '16px',
    height: '52px',
  };

  const showPagination = table.getPageCount() > 1;

  return (
    <div className="flex flex-col gap-[30px] w-full overflow-hidden">
      {/* Buscador: Ajustado con margen superior y alineado a la tabla */}
      <div 
        style={{ 
          padding: '25px 20px 0 20px', // 25px de espacio arriba para que baje
          position: 'relative', 
          width: '100%' 
        }} 
      >
        <Search 
          style={{ 
            position: 'absolute', 
            left: '32px', 
            top: 'calc(50% + 12.5px)', // Ajuste fino por el padding-top
            transform: 'translateY(-50%)', 
            zIndex: 10 
          }} 
          className="h-4 w-4 text-muted-foreground" 
        />
        <Input
          placeholder="Filtrar por ruta..."
          value={table.getColumn('ruta')?.getFilterValue() ?? ''}
          onChange={(event) =>
            table.getColumn('ruta')?.setFilterValue(event.target.value)
          }
          style={{ 
            paddingLeft: '45px',
            height: '45px' // Un poco más alto para mejor UI
          }}
          className="w-full" // Ahora ocupa el ancho de la tabla
        />
      </div>

      {/* Tabla */}
      <div style={{ 
        margin: '0 20px', 
        border: '1px solid #e2e8f0', 
        borderRadius: '8px', 
        backgroundColor: 'white',
        overflow: 'hidden'
      }}>
        <Table style={{ tableLayout: 'auto', width: '100%' }}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} style={cellStyle} className="whitespace-nowrap">
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
                    <TableCell key={cell.id} style={cellStyle}>
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

      {/* Paginación */}
      {showPagination && (
        <div style={{ 
          padding: '0 20px 20px 0', 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: '12px' 
        }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            style={{ height: '38px', padding: '0 16px', border: '1px solid #cbd5e1' }}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            style={{ height: '38px', padding: '0 16px', border: '1px solid #cbd5e1' }}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
};