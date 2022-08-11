const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, categoriasGet, categoriaGet, categoriaPut, categoriaDelete } = require('../controllers/Categorias');
const { existeCategoria } = require('../helpers/db-validators');
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');

const router = Router();

//obtener todas las categorias - publico
router.get('/', categoriasGet);


//obtener todas las categorias - por id - publico
//middlware personalizado para validar en las rutas q pide el ID
router.get('/:id',
    [
        check('id', 'No es un ID de Mongo valido').isMongoId(),
        check('id').custom(existeCategoria),
        validarCampos,
    ], categoriaGet);


//Crear categoria - privado - cualquier persona con token valido
router.post('/',
    [
        validarJWT,
        check('nombre', 'Es obligario').notEmpty(),
        validarCampos
    ], crearCategoria);

//Actualizar privado con token valido
router.put('/:id',
    [
        validarJWT,
        check('id', 'No es un ID de Mongo valido').isMongoId(),
        check('nombre', 'Es obligario').notEmpty(),
        check('id').custom(existeCategoria),
        validarCampos
    ], categoriaPut);



//borrar solo si es admin - cambia estado a false
router.delete('/:id',
[
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID de Mongo valido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], categoriaDelete);

module.exports = router;
