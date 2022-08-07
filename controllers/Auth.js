const { response, json } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSingIn = async (req, res = response) => {
    const { id_token } = req.body;
    try {
        const { nombre, img, correo } = await googleVerify(id_token);
        //verificar si ya esta en la base de datos
        let usuario = await Usuario.findOne({ correo });
        if (!usuario) {//crear usuario
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true,
                estado: true,
                rol: 'USER_ROLE'
            };
            usuario = new Usuario(data);
            await usuario.save();
        }
        else{
            
        }

        //si el usuario en  DB
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Comuniquese con el Admin del sistema'
            });
        }

        //Generar el Token
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: error
        });
    }
}

module.exports = {
    login,
    googleSingIn
}