
const { response } = require('express');

const usuariosGet = (req, res) => {
    const params = req.query;
    res.json({
        ok: true,
        mgs: 'get API - Controller',
        params
    });
}

const usuariosPost = (req, res) => {
    const { nombre, edad } = req.body;

    res.json({
        ok: true,
        mgs: 'post API - Controller',
        nombre,
        edad
    });
}

const usuariosPut = (req, res) => {
    const id = req.params.id;
    res.json({
        ok: true,
        mgs: 'put API - Controller',
        id
    });
}

const usuariosDelete = (req, res) => {
    res.json({
        ok: true,
        mgs: 'delete API - Controller'
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
}