# Casos Criminales — suscripción y notificaciones por correo

El blog ahora corre sobre un servidor Express. El formulario de "Súmate a la investigación" guarda el correo, y cada vez que se publica una entrada nueva desde `/admin.html` se le envía un correo a todos los suscritos.

## Estructura

```
app.js                  servidor (sirve el blog y la api)
public/                 el blog (index.html, styles.css, script.js) + admin.html
routes/                 rutas de la api
controllers/            lógica de suscribir, publicar y dar de baja
dao/                    guardado: versión txt y versión postgres (igual que en poo)
db/Conexion.js          singleton de conexión a postgresql
db/script_bd_postgresql.sql
db/migrarTxtAPostgres.js
config/db.properties    datos de la conexión (los mismos del proyecto de poo)
utils/correo.js         envío de correos con nodemailer
data/suscriptores.txt   aquí ves los correos ingresados (modo txt)
data/entradas.txt       aquí quedan las entradas publicadas (modo txt)
```

## Cómo correrlo

```
npm install
copy .env.example .env      (en mac/linux: cp .env.example .env)
npm run dev
```

Abrir **http://localhost:3000** (no abrir el index.html con doble clic, porque así no hay servidor y el formulario no puede guardar nada).

- Suscribirse: en el blog, abajo, poner un correo y darle a "Suscribirme". Queda en `data/suscriptores.txt` con el formato `fecha | correo`.
- Publicar una entrada: **http://localhost:3000/admin.html**, poner la clave (`ADMIN_CLAVE` del `.env`), título, resumen y enlace. Se guarda en `data/entradas.txt` y se manda el correo.
- Cada correo trae un enlace para darse de baja, que borra ese correo de la lista.

## Activar el envío real de correos (Gmail)

Gmail no deja usar la contraseña normal de la cuenta, hay que crear una **contraseña de aplicación**:

1. En la cuenta de Google que va a enviar, activar la verificación en dos pasos.
2. Ir a https://myaccount.google.com/apppasswords, crear una (nombre: "blog") y copiar las 16 letras.
3. En el `.env` poner:
   ```
   CORREO_USUARIO=esacuenta@gmail.com
   CORREO_CLAVE=las 16 letras
   ```
4. Reiniciar el servidor.

Si esas dos variables están vacías, la entrada igual se publica, solo que no se envían correos (en la terminal sale un aviso y en admin.html también).

## Pasar a la base de datos (PostgreSQL)

La conexión ya está configurada con los mismos datos del proyecto de POO (`localhost:5432`, usuario `postgres`, clave `12345678`, en `config/db.properties`). Solo cambia el nombre de la base a `casos_criminales` para no mezclar estas tablas con las de `gestion_tareas`.

1. Levantar el mismo Postgres de Docker que usamos en POO.
2. Crear la base y las tablas:
   ```
   docker exec -it some-postgres psql -U postgres -c "create database casos_criminales;"
   psql -U postgres -h localhost -d casos_criminales -f db/script_bd_postgresql.sql
   ```
3. Pasar los correos que ya están en el txt: `npm run migrar`
4. Por defecto ya usa PostgreSQL. Para volver al txt, poner `ALMACENAMIENTO=txt` en el `.env` y reiniciar.

No hay que tocar nada más del código: el resto del sistema usa los DAO, y `dao/index.js` decide cuál usar según esa variable.
