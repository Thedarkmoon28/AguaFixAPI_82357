# AguaFix API con fotos

## Configuración
Requiere Node.js 22 y PostgreSQL. Copia `.env.example` a `.env` y completa base de datos, correo y las claves NUEVAS de AWS. No reutilices las claves expuestas ni subas `.env` a Git.

Bucket: `aguafix-fotos-mario-82357`. Región: `us-east-2`. IAM requiere `s3:PutObject` sobre `reports/*` del bucket. La lectura pública se configura en S3; no se usan ACL públicas.

```sh
npm ci
npm run migration:run
npm run start:dev
```

Se conserva `synchronize: false`. La nueva migración añade las columnas sin borrar datos. Los reportes anteriores tienen `photoUrl: null`. Los nuevos requieren foto. `repairPhotoUrl` permanece en null porque la actividad no define carga de fotos de reparación.

## Endpoints
- POST /auth/register y POST /auth/login conservan su funcionamiento.
- POST /reports recibe multipart/form-data: address, description, severity (low, medium, high), reporterPhone y archivo obligatorio photo. Admite JPG, PNG y WebP de hasta 5 MiB; se comprueba el tipo declarado. Sube la foto, guarda la URL y solicita el correo con una etiqueta img. Sin foto devuelve 400. Si falla S3 no guarda el reporte. El correo mantiene el comportamiento previo: un error se registra sin borrar el reporte. Si falla la base después de subir la foto, puede quedar un archivo sin reporte en S3.
- GET /reports incluye photoUrl y repairPhotoUrl.

```sh
curl -X POST http://localhost:3000/reports -F "address=Calle 1" -F "description=Fuga" -F "severity=high" -F "reporterPhone=5551234567" -F "photo=@prueba.png"
```

En Bruno define photoPath con la ruta local de tu imagen.

## Docker y GitHub Actions
El workflow corre en cada push a main, compila, prueba y publica latest. Los Repository Secrets deben ser DOCKER_USER (usuario) y DOCKER_PASSWORD (token Read & Write).

Imagen: thedarkmoonx28/aguafix-api:latest. Docker usa Node 22 Alpine y ejecuta node dist/main. No copia .env ni compose.yaml. Las credenciales se proporcionan en tiempo de ejecución.

Después de publicar la imagen y completar tu .env:
```sh
docker compose pull
docker compose up -d
docker compose logs -f api
```

Compose inicia PostgreSQL y la API; ejecuta migraciones compiladas antes de iniciar. Respalda tu base antes de cambiar un despliegue previo y no borres sus volúmenes. Redis no es utilizado por el código de esta API.

## Pruebas
```sh
npm run build
npm test -- --runInBand
```
Sin .env define DB_USERNAME, DB_PASSWORD y DB_NAME temporalmente. Las pruebas HTTP y unitarias simulan S3, repositorio y correo. Debe completarse una prueba con PostgreSQL, S3 y SMTP reales antes de la entrega.
