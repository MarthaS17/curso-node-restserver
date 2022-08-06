
const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');//poner en uppercase xq es estandar

const usuariosGet = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    //ests metodos se demoran mucho tiempo en recuperar la respuesta 
    //     const usuarios = await Usuario.find(query)
    //         .skip(Number(desde))
    //         .limit(Number(limite));

    //     const total = await Usuario.countDocuments(query);

    const [total, usuarios] = await Promise.all([//Promise.all ejecuta ambas de manera simuktanea
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async (req, res) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    //encryptar la contraeña
    const salt = bcryptjs.genSaltSync();//por defecto 10 vueltas de encriptacion
    usuario.password = bcryptjs.hashSync(password, salt);

    //guardar en db
    await usuario.save();


    res.json({ usuario });
}

const usuariosPut = async (req, res) => {
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    //TODO validad contra la base de datos
    if (password) {
        //encryptar la contraeña
        const salt = bcryptjs.genSaltSync();//por defecto 10 vueltas de encriptacion
        resto.password = bcryptjs.hashSync(password, salt);

    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({ usuario });
}

const usuariosDelete = async (req, res) => {
    const { id } = req.params;
    //borrar fisicamente
    //const usuario = await Usuario.findByIdAndDelete(id);

    //cambir el estado
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

    res.json({
        usuario
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
}