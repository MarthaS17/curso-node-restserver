const { request, response } = require("express");
const { Categoria } = require('../models'); 

const crearCategoria = async (req = request, res = response) => {
    const nombre = req.body.nombre.toUpperCase();
    const categoriaDb = await Categoria.findOne({ nombre });
    if (categoriaDb) {
        return res.status(401).json({
            msg: `La categoria ${nombre} ya existe`
        })
    }
    //generar la data q necesito guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }
    const categoria = new Categoria(data);
    //guardar db
    await categoria.save();
    res.status(201).json(categoria);
}

//Obtener categoria - paginado- total - populate
const categoriasGet = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate("usuario", "nombre")//saca los datos del usuario
    ]);

    res.json({
        total,
        categorias,
    })
}

//Obtener categoria  - populate {}
const categoriaGet = async (req = request, res = response) => {
    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');
    res.json(categoria);
}

//Actualizar categoria - recibir solo nombre
const categoriaPut = async (req = request, res = response) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;  
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;
    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });//{new:true} para q se mire la respuesta en json
    res.json({ categoria });
}

//borrar categoria - cambiar estado
const categoriaDelete = async (req = request, res = response) => {
    const { id } = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });
    res.json(categoriaBorrada);
}

module.exports = {
    crearCategoria,
    categoriasGet,
    categoriaGet,
    categoriaPut,
    categoriaDelete
}