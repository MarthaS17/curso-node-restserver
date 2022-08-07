const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async (req, res) => {
    const { correo, password } = req.body;
    try {
        //verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                mgs: 'Usuario o Contraseña incorrectos - correo'
            });
        }
        //verificar si el usuario esta activo en la base
        if (!usuario.estado) {
            return res.status(400).json({
                mgs: 'Usuario o Contraseña incorrectos - estado:false'
            });
        }
        //verificar la contraseña
        const validPass = bcryptjs.compareSync(password, usuario.password);
        if (!validPass) {
            return res.status(400).json({
                mgs: 'Usuario o Contraseña incorrectos - password'
            });
        }
        //generar el web token
        const token = await generarJWT(usuario.id);

        res.json({
           usuario, 
           token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Comuniquese con el admin del sistema'
        });
    }
}

module.exports = {
    login
}