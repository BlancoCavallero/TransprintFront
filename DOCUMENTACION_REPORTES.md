# 📊 Documentación - Módulo de Reportes (Frontend)

## 📋 Descripción General

El módulo de reportes es una interfaz visual que permite consultar y visualizar reportes financieros de la empresa, divididos en tres categorías: Ganancias, Gastos y Viáticos.

---

## 🏗️ Arquitectura del Frontend

### Estructura de Archivos

```
TransprintFront/src/
├── services/
│   └── reporteService.js              # Llamadas HTTP al backend
├── hooks/
│   └── entities/
│       └── useReporte.js              # Lógica de estado y fetching
└── pages/
    └── Reporte/
        ├── Reporte.jsx                # Componente principal
        ├── ReportFilters.jsx          # Filtros de mes/año
        ├── ReportSummary.jsx          # Tarjetas de resumen
        ├── EarningsTab.jsx            # Tab de Ganancias
        ├── ExpensesTab.jsx            # Tab de Gastos
        └── AllowancesTab.jsx          # Tab de Viáticos
```

---

## 🔄 Flujo de Datos

```
1. Usuario selecciona filtros → ReportFilters.jsx
2. Filtros se aplican → Reporte.jsx (setFiltros)
3. useEffect detecta cambio → Reporte.jsx
4. Llama a hooks → useReporte.js
5. Hook llama servicio → reporteService.js
6. Servicio hace HTTP → Backend API
7. Respuesta se guarda en estado → useReporte.js
8. Componentes renderizan datos → EarningsTab/ExpensesTab/AllowancesTab
```

---

## 📦 Componentes

### 1️⃣ Reporte.jsx (Componente Principal)

**Responsabilidades:**
- Gestionar el estado de filtros
- Coordinar las llamadas a los 3 reportes
- Manejar los tabs (Ganancias, Gastos, Viáticos)
- Mostrar estados de loading/error

**Props:** Ninguna (es una página)

**Estado interno:**
```javascript
const [filtros, setFiltros] = useState({ 
  mes: null,      // null = todos los meses
  anio: 2026      // Año actual por defecto
});
const [activeTab, setActiveTab] = useState("earnings");
```

**Hooks utilizados:**
```javascript
const {
  reporteGanancias,     // Datos del reporte
  loadingGanancias,     // Estado de carga
  errorGanancias,       // Mensajes de error
  fetchReporteGanancias // Función para refetch
  // ... (idem para gastos y viáticos)
} = useReporte();
```

---

### 2️⃣ ReportFilters.jsx

**Responsabilidades:**
- Mostrar selectores de mes y año
- Aplicar y limpiar filtros

**Props:**
```typescript
{
  onApplyFilters: (filtros: { mes: number|null, anio: number }) => void,
  initialFiltros: { mes: number|null, anio: number }
}
```

**Opciones de mes:**
- "Todos los meses" → `mes: null`
- Enero - Diciembre → `mes: 1-12`

**Opciones de año:**
- Últimos 5 años desde el año actual

**Eventos:**
```javascript
// Aplicar filtros seleccionados
handleApplyFilters() → onApplyFilters({ mes, anio })

// Limpiar filtros (resetear a año actual, todos los meses)
handleClearFilters() → onApplyFilters({ mes: null, anio: añoActual })
```

---

### 3️⃣ EarningsTab.jsx

**Responsabilidades:**
- Mostrar totalizadores de ganancias
- Listar viajes finalizados con sus cálculos

**Props:**
```typescript
{
  data: {
    totalizadores: {
      ingresos: number,
      gastos: number,
      ganancia: number,
      margenGanancia: number
    },
    viajes: Array<Viaje>,
    filtros: { mes: number|null, anio: number }
  },
  filtros: { mes: number|null, anio: number }
}
```

**Componentes visuales:**
- 4 tarjetas de resumen (Ingresos, Gastos, Ganancia, Margen %)
- Card con resumen del período (mensual/anual)
- Tabla de viajes finalizados

**Tabla de viajes:**
| Fecha Inicio | Fecha Fin | Ruta | Precio | Gastos | Ganancia |
|--------------|-----------|------|--------|--------|----------|
| 20/01/2026 | 31/01/2026 | Avellaneda → Bariloche | $2,000 | $208,222 | -$206,222 |

---

### 4️⃣ ExpensesTab.jsx

**Responsabilidades:**
- Mostrar totalizadores por tipo de gasto
- Listar detalle de todos los gastos

**Props:**
```typescript
{
  data: {
    totalizadores: {
      combustible: number,
      viatico: number,
      peaje: number,
      total: number
    },
    gastos: Array<Gasto>,
    filtros: { mes: number|null, anio: number }
  },
  filtros: { mes: number|null, anio: number }
}
```

**Componentes visuales:**
- 4 tarjetas por tipo (Combustible, Viático, Peaje, Total)
- Tabla con detalle de gastos

**Tabla de gastos:**
| Fecha | Tipo | Descripción | Monto | Viaje |
|-------|------|-------------|-------|-------|
| 31/01/2026 | Viatico | Comida | $100,000 | Avellaneda → Bariloche |

**Badges de tipo:**
- 🟠 Combustible → Naranja
- 🔵 Viático → Azul
- 🟣 Peaje → Morado

---

### 5️⃣ AllowancesTab.jsx

**Responsabilidades:**
- Mostrar resumen total de viáticos
- Listar viáticos por chofer

**Props:**
```typescript
{
  data: {
    totalizadores: {
      totalViaticos: number,
      cantidadChoferes: number
    },
    choferes: Array<{
      idChofer: number,
      nombreCompleto: string,
      totalViaticos: number,
      cantidadViajes: number
    }>,
    filtros: { mes: number|null, anio: number }
  },
  filtros: { mes: number|null, anio: number }
}
```

**Componentes visuales:**
- 2 tarjetas de resumen (Total Viáticos, Cantidad Choferes)
- Tabla de viáticos por chofer con promedio

**Tabla de choferes:**
| Chofer | Cantidad Viajes | Total Viáticos | Promedio por Viaje |
|--------|-----------------|----------------|-------------------|
| 👤 Axel Monzon | 1 viaje | $202,900 | $202,900 |

---

## 🎣 Hook: useReporte.js

### Responsabilidades
- Gestionar estado de los 3 tipos de reportes
- Realizar llamadas al backend
- Manejar loading y errores

### Estados gestionados:
```javascript
// Datos
const [reporteGanancias, setReporteGanancias] = useState(null);
const [reporteGastos, setReporteGastos] = useState(null);
const [reporteViaticos, setReporteViaticos] = useState(null);

// Loading
const [loadingGanancias, setLoadingGanancias] = useState(false);
const [loadingGastos, setLoadingGastos] = useState(false);
const [loadingViaticos, setLoadingViaticos] = useState(false);

// Errores
const [errorGanancias, setErrorGanancias] = useState(null);
const [errorGastos, setErrorGastos] = useState(null);
const [errorViaticos, setErrorViaticos] = useState(null);
```

### Funciones expuestas:

#### `fetchReporteGanancias(filtros)`
```javascript
// Ejemplo de uso
const { fetchReporteGanancias } = useReporte();

await fetchReporteGanancias({ mes: 1, anio: 2026 });
// → Actualiza reporteGanancias con los datos
```

#### `fetchReporteGastos(filtros)`
Idem anterior para gastos.

#### `fetchReporteViaticos(filtros)`
Idem anterior para viáticos.

---

## 🌐 Servicio: reporteService.js

### Funciones disponibles:

#### `getReporteGanancias(params)`
```javascript
import { getReporteGanancias } from '@/services/reporteService';

const response = await getReporteGanancias({ 
  mes: 1,     // Opcional
  anio: 2026  // Opcional
});
```

#### `getReporteGastos(params)`
#### `getReporteViaticos(params)`

Todas retornan:
```javascript
{
  success: true,
  data: { /* datos del reporte */ },
  message: ""
}
```

---

## 🎨 Estilos y UI

### Tecnologías utilizadas:
- **Tailwind CSS**: Estilos utility-first
- **shadcn/ui**: Componentes de UI
  - `Card`, `CardHeader`, `CardContent`
  - `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
  - `Select`, `SelectContent`, `SelectItem`
  - `Button`
  - `Alert`, `AlertDescription`

### Iconos (lucide-react):
- 📊 `BarChart` - Icono principal de reportes
- 📈 `TrendingUp` - Ingresos
- 📉 `TrendingDown` - Gastos
- 💰 `DollarSign` - Ganancia
- 📊 `PieChart` - Margen
- ⛽ `Fuel` - Combustible
- 🍽️ `Utensils` - Viático
- 💳 `CreditCard` - Peaje
- 👥 `Users` - Choferes
- 🔄 `Loader2` - Loading spinner

### Colores semánticos:
```css
/* Ingresos/Ganancias positivas */
.text-green-600 

/* Gastos/Pérdidas */
.text-red-600

/* Información general */
.text-blue-600

/* Estados */
.bg-green-50   /* Fondo positivo */
.bg-red-50     /* Fondo negativo */
.bg-blue-50    /* Fondo neutral */
```

---

## 📱 Responsividad

### Breakpoints utilizados:
```javascript
// Grid de tarjetas
grid-cols-1 sm:grid-cols-2 lg:grid-cols-4

// Filtros
flex-col md:flex-row

// Tablas
overflow-x-auto (scroll horizontal en móviles)
```

---

## 🔄 Estados del Componente

### Loading
```jsx
{loadingGanancias && (
  <Loader2 className="h-8 w-8 animate-spin" />
)}
```

### Error
```jsx
{errorGanancias && (
  <Alert variant="destructive">
    <AlertDescription>{errorGanancias}</AlertDescription>
  </Alert>
)}
```

### Sin Datos
```jsx
{!viajes || viajes.length === 0 && (
  <p className="text-center text-muted-foreground">
    No hay viajes completados en este período
  </p>
)}
```

### Con Datos
```jsx
<table>...</table>
```

## 🚀 Cómo Usar

### Para el usuario final:

1. **Navegar a la sección Reportes** en el menú
2. **Seleccionar filtros:**
   - Elegir mes específico o "Todos los meses"
   - Elegir año
3. **Click en "Aplicar"**
4. **Navegar entre tabs:**
   - **Ganancias**: Ver ingresos, gastos y ganancias por viaje
   - **Gastos**: Ver detalle de gastos por tipo
   - **Viáticos**: Ver viáticos por chofer

### Para desarrolladores:

```javascript
// Usar el hook en un componente
import { useReporte } from '@/hooks/entities/useReporte';

function MiComponente() {
  const { 
    reporteGanancias, 
    loadingGanancias, 
    fetchReporteGanancias 
  } = useReporte();

  useEffect(() => {
    fetchReporteGanancias({ mes: null, anio: 2026 });
  }, []);

  if (loadingGanancias) return <Loading />;
  
  return <div>{reporteGanancias.totalizadores.ingresos}</div>;
}
```

---

## 🧪 Casos de Prueba

### 1. Filtrar por mes específico
```
Entrada: mes=1, anio=2026
Resultado: Solo viajes finalizados en enero 2026
```

### 2. Filtrar por año completo
```
Entrada: mes=null, anio=2026
Resultado: Todos los viajes finalizados en 2026
```

### 3. Sin datos
```
Entrada: mes=12, anio=2020
Resultado: Mensaje "No hay viajes completados en este período"
```

### 4. Ganancia negativa
```
Precio viaje: $2,000
Gastos: $208,222
Resultado: Ganancia -$206,222 (texto en rojo)
```

---

## 📝 Formato de Números

Todos los montos usan formato argentino:
```javascript
const formateado = monto.toLocaleString("es-AR", { 
  minimumFractionDigits: 2,
  maximumFractionDigits: 2 
});

// 2000.5 → "2.000,50"
// 208222 → "208.222,00"
```

---

## 🔧 Mantenimiento

### Para agregar un nuevo tab:

1. **Crear componente** `NuevoTab.jsx` en `/pages/Reporte/`
2. **Crear endpoint** en `reporteService.js`
3. **Agregar estado** en `useReporte.js`
4. **Importar en** `Reporte.jsx`:
```javascript
import { NuevoTab } from './NuevoTab';

<TabsList>
  <TabsTrigger value="nuevo">Nuevo</TabsTrigger>
</TabsList>

<TabsContent value="nuevo">
  <NuevoTab data={reporteNuevo} filtros={filtros} />
</TabsContent>
```

---

## 📌 Notas Importantes

- ⚠️ Los filtros se aplican al hacer click en "Aplicar"
- ⚠️ El año por defecto es el año actual
- ⚠️ Mes `null` significa "todos los meses del año"
- ⚠️ Las fechas se muestran en formato DD/MM/YYYY
- ⚠️ Los montos negativos se muestran en rojo
- ⚠️ Cada tab carga sus datos de forma independiente
