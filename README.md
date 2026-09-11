# Water Reports API

API REST para el reporte ciudadano de fugas de agua y gestión de usuarios del sistema desarrollada con NestJS, TypeORM y PostgreSQL.

## Requisitos

- Node.js (v18+)
- Docker y Docker Compose

## Configuración

1. Clonar el repositorio y copiar las variables de entorno:
```bash
cp .env.example .env
```

2. Instalar dependencias:
```bash
npm install
```

3. Levantar la base de datos con Docker:
```bash
docker compose up -d
```

4. Ejecutar las migraciones:
```bash
npm run migration:run
```

5. Iniciar la aplicación:
```bash
npm run start:dev
```

## Endpoints

### Auth
- `POST /auth/register`: Registro de usuario (`name`, `email`, `password`, `isNotificationEnabled`).
- `POST /auth/login`: Inicio de sesión (`email`, `password`).

### Reports
- `POST /reports`: Crea un reporte de fuga y envía notificación por correo (`address`, `description`, `severity`, `reporterPhone`).
- `GET /reports`: Lista todos los reportes de fugas registrados.

## Pruebas

```bash
npm run test
```
