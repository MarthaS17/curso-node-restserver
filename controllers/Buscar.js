const { request, response } = require("express");
const { Usuario } = require("../models");
const { ObjectId } = require("mongoose").Types;
const usuario = require("../models/usuario");

const coleccionesPermitidas =
    [
        'usuarios', 'roles', 'categorias', 'productos'
    ];

const BuscarUsuarios = async (termino = '', res = response) => {
    const esMongoId = ObjectId.isValid(termino);
    if (esMongoId) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: usuario ? [usuario] : []
        });
    }

    //buscar por el termino - palabras
    //expresiones regulares
    const regex = new RegExp(termino, 'i');//'i' insensible

    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });
    res.json({
        results: usuarios
    });

}

const buscar = (req = request, res = response) => {

    const { coleccion, termino } = req.params
    if (!coleccionesPermitidas.includes(coleccion)) {
        res.status(400).json({
            msg: `Las colecciones permitidas son ${coleccionesPermitidas}`
        });
    }
    switch (coleccion) {
        case "usuarios":
            BuscarUsuarios(termino, res);
            break;
        case "roles":

            break;
        case "productos":

            break;
        case "categorias":

            break;
        default:
            return res.status(500).json({
                msg: `No existe busqueda para la coleccion ${coleccion}`
            });
            break;
    }
}

module.exports = {
    buscar
}