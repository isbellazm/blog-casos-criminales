-- correr una vez, conectado a la base casos_criminales
-- create database casos_criminales;

drop table if exists entrada;
drop table if exists suscriptor;

create table suscriptor (
    id_suscriptor serial primary key,
    correo varchar(150) not null unique,
    fecha_suscripcion timestamp not null default now()
);

create table entrada (
    id_entrada serial primary key,
    titulo varchar(200) not null,
    resumen text not null,
    enlace varchar(300),
    fecha_publicacion timestamp not null default now()
);
