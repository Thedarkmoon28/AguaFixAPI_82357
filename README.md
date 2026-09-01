# Animal API - NestJS + TypeORM + PostgreSQL + Bruno

API RESTful desarrollada con [NestJS](https://nestjs.com/), [TypeORM](https://typeorm.io/) y [PostgreSQL (PostGIS)](https://postgis.net/), con soporte completo para migraciones, validación de DTOs, Docker Compose y colección de pruebas en [Bruno](https://www.usebruno.com/).

---

## 📋 Entidad `Animal`

| Campo | Tipo | Restricciones / Descripción |
| :--- | :--- | :--- |
| `id` | `number` | PK autoincremental / autogenerado |
| `nombre` | `string` | Nombre del animal (Requerido) |
| `especie` | `string` | Especie científica/común (ej. `"Canis lupus"`, Requerido) |
| `raza` | `string` | Raza si aplica (Opcional/Nullable) |
| `edad` | `number` | Edad en años (Entero no negativo) |
| `peso` | `number` | Peso en kg (Decimal positivo) |

---

## 🚀 Requisitos Previos

- [Node.js](https://nodejs.org/) (v18 o superior)
- [Docker](https://www.docker.com/) y Docker Compose
- [Bruno](https://www.usebruno.com/) para ejecutar la colección de peticiones

---

## ⚙️ Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd Animal_api
```

### 2. Variables de Entorno
Crea un archivo `.env` en la raíz (puedes tomar como base `.env.example`):
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=animal_db
```

### 3. Instalar Dependencias
```bash
npm install
```

### 4. Levantar la Base de Datos con Docker
```bash
docker compose up -d
```

### 5. Ejecutar Migraciones de TypeORM
```bash
npm run migration:run
```

Si deseas generar nuevas migraciones tras modificar la entidad:
```bash
npm run migration:generate -- src/db/migrations/NombreDeLaMigracion
```

### 6. Iniciar el Servidor de Desarrollo
```bash
npm run start:dev
```
La API estará disponible en: `http://localhost:3000`

---

## 📡 Endpoints de la API (`/animal`)

### 1. Crear un Animal
- **Método**: `POST`
- **URL**: `http://localhost:3000/animal`
- **Body** (`application/json`):
```json
{
  "nombre": "Lobo Gris",
  "especie": "Canis lupus",
  "raza": "Lobo euroasiático",
  "edad": 4,
  "peso": 42.5
}
```
- **Respuesta (201 Created)**:
```json
{
  "id": 1,
  "nombre": "Lobo Gris",
  "especie": "Canis lupus",
  "raza": "Lobo euroasiático",
  "edad": 4,
  "peso": 42.5
}
```

### 2. Obtener Todos los Animales
- **Método**: `GET`
- **URL**: `http://localhost:3000/animal`
- **Respuesta (200 OK)**:
```json
[
  {
    "id": 1,
    "nombre": "Lobo Gris",
    "especie": "Canis lupus",
    "raza": "Lobo euroasiático",
    "edad": 4,
    "peso": 42.5
  }
]
```

### 3. Obtener un Animal por ID
- **Método**: `GET`
- **URL**: `http://localhost:3000/animal/:id` (ej. `/animal/1`)
- **Respuesta (200 OK)**:
```json
{
  "id": 1,
  "nombre": "Lobo Gris",
  "especie": "Canis lupus",
  "raza": "Lobo euroasiático",
  "edad": 4,
  "peso": 42.5
}
```

### 4. Actualizar un Animal
- **Método**: `PATCH`
- **URL**: `http://localhost:3000/animal/:id` (ej. `/animal/1`)
- **Body** (`application/json`):
```json
{
  "edad": 5,
  "peso": 45.0
}
```
- **Respuesta (200 OK)**:
```json
{
  "id": 1,
  "nombre": "Lobo Gris",
  "especie": "Canis lupus",
  "raza": "Lobo euroasiático",
  "edad": 5,
  "peso": 45.0
}
```

### 5. Eliminar un Animal
- **Método**: `DELETE`
- **URL**: `http://localhost:3000/animal/:id` (ej. `/animal/1`)
- **Respuesta (200 OK)**:
```json
{
  "message": "Animal con ID 1 eliminado correctamente"
}
```

---

## 🧪 Colección Bruno

La carpeta [`bruno_collection/`](./bruno_collection) incluye:
- `bruno.json` (Manifiesto de la colección)
- `environments/Local.bru` (`baseUrl: http://localhost:3000`)
- `1 - Create Animal.bru`
- `2 - Get All Animals.bru`
- `3 - Get Animal by ID.bru`
- `4 - Update Animal.bru`
- `5 - Delete Animal.bru`

### Cómo usarla en Bruno:
1. Abre **Bruno**.
2. Haz clic en **Open Collection**.
3. Selecciona la carpeta `bruno_collection` dentro de este proyecto.
4. Selecciona el entorno **Local** en la esquina superior derecha.
5. Ejecuta las peticiones en orden secuencial (1 al 5).

---

## 📦 Scripts Disponibles

- `npm run start:dev` - Inicia la API en modo de desarrollo con recarga automática.
- `npm run build` - Compila el proyecto TypeScript a la carpeta `dist`.
- `npm run typeorm` - Ejecuta la CLI de TypeORM.
- `npm run migration:generate -- <path>` - Genera una nueva migración detectando cambios en entidades.
- `npm run migration:run` - Ejecuta las migraciones pendientes en la base de datos.
- `npm run migration:revert` - Revierte la última migración aplicada.

---

## 🔗 Subir a GitHub

Para vincular este repositorio local con tu repositorio remoto de GitHub:
```bash
git remote add origin https://github.com/<TU_USUARIO>/<TU_REPOSITORIO>.git
git branch -M main
git push -u origin main
```
