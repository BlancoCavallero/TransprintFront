# ⚡ React + Vite

Este proyecto utiliza **React** junto con **Vite**.  

## 🛠️ Requisitos previos
- [Node.js](https://nodejs.org/) instalado en tu máquina.
- [Git](https://git-scm.com/) para clonar el repositorio.

## 🚀 Pasos para correr el frontend

1. Clonar el repositorio  
   ```bash
   git clone "ruta-del-repositorio"
   
2. Navegar al directorio del proyecto
    ```bash
    cd "nombre-del-repositorio"

3. Instalar las dependencias
    ```bash
    npm install

4. Ejecutar en modo desarrollo
    ```bash
    npm run dev

La aplicación estará disponible usualmente en: http://localhost:5173

## 🤝 Para comenzar a trabajar

**A partir de development actualizado**

1. Crea una rama para feature
    ```bash
    git checkout -b feature/NombreDescriptivo

2. Commit de cambios 
    ```bash
    git commit -m 'name: Haciendo el commit'
3. Push de la rama 
    ```bash
    git push origin feature/NombreDescriptivo

## 📁 Estructura del Proyecto

```
TransprintFront/
├── public/                    # Solo dejar un archivo que es el favicon usando en el HTML
├── src/                       # Código fuente principal
│   ├── assets/               # Recursos (imágenes, iconos, etc.)
│   ├── components/           # Componentes reutilizables
│   ├── configuration/        # Archivos de configuración
│   ├── context/             # Context API de React
│   ├── hooks/               # Custom hooks
│   ├── pages/               # Páginas de la aplicación
│   │   ├── Chofer/          # Página de Chofer
│   │   ├── Login/           # Página de Login
│   │   │   ├── Login.css    # Estilos del Login
│   │   │   └── Login.jsx    # Componente de Login
│   ├── routes/              # Configuración de rutas
│   ├── services/            # Servicios y APIs
│   ├── utils/               # Utilidades y helpers
│   ├── App.jsx              # Componente principal
│   ├── global.css           # Estilos globales
│   └── main.jsx             # Punto de entrada de React
├── .gitignore               # Archivos ignorados por Git
├── eslint.config.js         # Configuración de ESLint
├── index.html               # HTML principal de entrada
├── package-lock.json        # Lock file de dependencias
├── package.json             # Dependencias y scripts
├── README.md                # Documentación del proyecto
└── vite.config.js           # Configuración de Vite
```