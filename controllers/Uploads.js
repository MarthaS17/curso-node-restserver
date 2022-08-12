const path = require('path');//raiz de la app
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { request, response } = require("express");
const { subirArchivo } = require('../helpers');
const { Usuario, Producto } = require("../models");

const cargarArchivo = async (req = request, res = response) => {
    try {
        const nombre = await subirArchivo(req.files, undefined, 'imgs');
        res.json({
            path: nombre
        });
    } catch (msg) {
        res.status(400).json({
            msg
        });
    }
}

const actualizarImagen = async (req = request, res = response) => {

    const { id, coleccion } = req.params;
    let modelo;
    switch (coleccion) {
        case "usuarios":
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un usuario con el id ${id}` })
            }

            break;
        case "productos":
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un productos con el id ${id}` })
            }

            break;
        default:

            return res.status(500).json({ msg: `Se me olvido implementar esta coleccion ${coleccion}` });
    }
    //Borrar la imagen actual/previas
    if (modelo.img) {//si tiene la propiedad img existe
        //borrar la img del servr
        const pathImg = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImg)) {
            fs.unlinkSync(pathImg);//delete img
        }
    }
    //subir la nueva imagen
    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;
    await modelo.save();
    res.json({
        modelo
    })
}

const actualizarImgCloudinary = async (req = request, res = response) => {

    const { id, coleccion } = req.params;
    let modelo;
    switch (coleccion) {
        case "usuarios":
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un usuario con el id ${id}` })
            }

            break;
        case "productos":
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un productos con el id ${id}` })
            }

            break;
        default:

            return res.status(500).json({ msg: `Se me olvido implementar esta coleccion ${coleccion}` });
    }
    //Borrar la imagen actual/previas
    if (modelo.img) {//si tiene la propiedad img existe
        //borrar la img del servr
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');
        cloudinary.uploader.destroy(public_id);
    }
    //subir la nueva imagen
    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    modelo.img = secure_url;
    await modelo.save();
    res.json({
        modelo
    })
}

const mostrarImagen = async (req = request, res = response) => {
    const { id, coleccion } = req.params;
    let modelo;
    switch (coleccion) {
        case "usuarios":
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un usuario con el id ${id}` })
            }
            break;
        case "productos":
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un productos con el id ${id}` })
            }
            break;
        default:
            return res.status(500).json({ msg: `Se me olvido implementar esta coleccion ${coleccion}` });
    }
    //Borrar la imagen actual/previas
    if (modelo.img) {//si tiene la propiedad img existe
        //borrar la img del servr
        const pathImg = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImg)) {
            return res.sendFile(pathImg);
        }
    }
    const pathImg = path.join(__dirname, '../assets/no-image.jpg');
    return res.sendFile(pathImg);
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImgCloudinary
}