function soloAdmin(req, res, next) {
    const clave = req.get("x-admin-clave");
    if (!process.env.ADMIN_CLAVE || clave !== process.env.ADMIN_CLAVE) {
        return res.status(401).json({ mensaje: "Clave de administrador incorrecta" });
    }
    next();
}

module.exports = soloAdmin;
