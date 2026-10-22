# Casos Criminales 
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


## Pasar a la base de datos (PostgreSQL)

La conexión ya está configurada con los mismos datos del proyecto de POO (`localhost:5432`, usuario `postgres`, clave `12345678`, en `config/db.properties`). Solo cambia el nombre de la base a `casos_criminales` para no mezclar estas tablas con las de `gestion_tareas`.

1. Levantar Postgres.
2. Crear la base y las tablas:
   ```
   docker exec -it some-postgres psql -U postgres -c "create database casos_criminales;"
   psql -U postgres -h localhost -d casos_criminales -f db/script_bd_postgresql.sql
   ```
