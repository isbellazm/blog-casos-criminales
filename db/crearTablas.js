const Conexion = require("./Conexion");

async function crearTablas() {
    const pool = Conexion.getInstancia().getPool();

    await pool.query(`
        create table if not exists suscriptor (
            id_suscriptor serial primary key,
            correo varchar(150) not null unique,
            fecha_suscripcion timestamp not null default now()
        )
    `);

    await pool.query(`
        create table if not exists entrada (
            id_entrada serial primary key,
            titulo varchar(200) not null,
            resumen text not null,
            enlace varchar(300),
            fecha_publicacion timestamp not null default now()
        )
    `);
}

module.exports = { crearTablas };
