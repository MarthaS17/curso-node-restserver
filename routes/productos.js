const { Router } = require('express');
const { check } = require('express-validator');
const { PostProducto, PutProducto, DeleteProducto, GetAllProducto, GetProducto } = require('../controllers/Productos');
const { existeProducto, existeCategoria } = require('../helpers/db-validators');
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');

const router = Router();

//Crear
router.post('/',
    [
        validarJWT,
        check('nomb', "El nombre es obligatorio").notEmpty(),
        // check('categoria', "No es un id de mongo valido").isMongoId,
        // check('categoria').custom(existeCategoria),
        validarCampos
    ], PostProducto);

//Modificar
router.put('/:id',
    [
        validarJWT,
        check('id', 'No es un Id de Mongo Valido').isMongoId(),
        check('nomb', 'Es obligario').notEmpty(),
        check('id').custom(existeProducto),
        validarCampos
    ], PutProducto);

// //eliminar
router.delete('/:id',
    [
        validarJWT,
        esAdminRole,
        check('id', 'No es un Id de Mongo Valido').isMongoId(),
        check('id').custom(existeProducto),
        validarCampos
    ], DeleteProducto);

// //Obtener todo
router.get('/', GetAllProducto);

// //Obtener por Id
router.get('/:id',
    [
        check('id', 'No es un ID de Mongo valido').isMongoId(),
        check('id').custom(existeProducto),
        validarCampos,
    ], GetProducto);

module.exports = router;