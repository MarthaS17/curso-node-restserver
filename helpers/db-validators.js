const { Categoria, Usuario, Role, Producto } = require('../models');

const esRolValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no existe`);
    }
}

const emailExiste = async (correo = '') => {
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El email ${correo} ya existe.`);
    }
}

const existeUsuarioPorId = async (id) => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El usuario ${id} no existe.`);
    }
}

const existeCategoria = async (id = '') => {
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`La categoria ${id} no existe.`);
    }
}

const existeProducto = async (id = '') => {
    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`El producto ${id} no existe.`);
    }
}
/*
Validar colecciones permitdas
*/
const colecPermitidas = (coleccion = '', colecciones = []) => {
    const existe = colecciones.includes(coleccion);
    if (!existe) {
        throw new Error(`La coleccion ${coleccion} no es permitida, las validas son ${colecciones}`);
    }
    return true;
}

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoria,
    existeProducto,
    colecPermitidas
}