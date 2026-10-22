const Conexion = require("../db/Conexion");

class SuscriptorDAOPostgres {

    pool() {
        return Conexion.getInstancia().getPool();
    }

    async listar() {
        const resultado = await this.pool().query(
            "select correo, to_char(fecha_suscripcion, 'YYYY-MM-DD HH24:MI') as fecha "
            + "from suscriptor order by fecha_suscripcion"
        );
        return resultado.rows;
    }

    async existe(correo) {
        const resultado = await this.pool().query(
            "select 1 from suscriptor where correo = $1", [correo]
        );
        return resultado.rowCount > 0;
    }

    async guardar(correo) {
        await this.pool().query("insert into suscriptor (correo) values ($1)", [correo]);
        return true;
    }

    async eliminar(correo) {
        const resultado = await this.pool().query("delete from suscriptor where correo = $1", [correo]);
        return resultado.rowCount > 0;
    }
}

module.exports = SuscriptorDAOPostgres;
