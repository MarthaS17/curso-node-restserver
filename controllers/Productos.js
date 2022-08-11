const { request, response } = require('express');
const { body } = require('express-validator');
const { Producto } = require('../models');

const PostProducto = async (req = request, res = response) => {
    const { stus, usuario, ...body } = req.body;

    const nomb = body.nomb.toUpperCase();
    const prod = await Producto.findOne({ nomb });
    if (prod) {
        return res.status(401).json({
            msg: `El producto ${nomb} ya existe.`
        });
    }
    //genero la data q necesito guardar
    const data = {
        ...body,
        nomb,
        usuario: req.usuario._id,
        //producto: req.producto.id
    }
    const producto = new Producto(data);
    await producto.save();
    res.status(201).json(producto);
}

const PutProducto = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { stus, usuario, ...data } = req.body;
        if (data.nomb) {
            data.nomb = data.nomb.toUpperCase();
        }
        data.prec = Number(data.prec);
        data.usuario = req.usuario._id;
        let prod = await Producto.findByIdAndUpdate(id, data, { new: true });
        res.json({
            prod
        });
    } catch (error) {
        res.status(500).json({
            msg: "Comuniquese con el admin del sistema",
            error
        })
    }
}

const DeleteProducto = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        let prod = await Producto.findByIdAndUpdate(id, { stus: false }, { new: true });
        res.json({
            prod
        });
    } catch (error) {
        res.status(500).json({
            msg: "Comuniquese con el admin del sistema",
            error
        })
    }
}


const GetProducto = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');
        res.json(producto);
    } catch (error) {
        res.status(500).json({
            msg: "Comuniquese con el admin del sistema",
            error
        })
    }
}

const GetAllProducto = async (req = request, res = response) => {
    try {
        const { limite = 5, desde = 0 } = req.query;
        const query = { estado: true }

        const [total, productos] = await Promise.all([
            Producto.countDocuments(query),
            Producto.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
                .populate("usuario", "nombre")//saca los datos del usuario
                .populate("categoria", "nombre")//saca los datos del usuario
        ]);

        res.json({
            total,
            productos,
        })
    } catch (error) {
        res.status(500).json({
            msg: "Comuniquese con el admin del sistema",
            error
        })
    }
}

module.exports = {
    PostProducto,
    PutProducto,
    DeleteProducto,
    GetProducto,
    GetAllProducto
}