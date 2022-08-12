const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImgCloudinary } = require('../controllers/Uploads');
const { colecPermitidas } = require('../helpers');
const { validarCampos, validarArchivo } = require('../middlewares');


const router = Router();

router.post('/', validarArchivo, cargarArchivo);

router.put('/:coleccion/:id',
    [
        validarArchivo,
        check('id', 'No es un id de mongo valido').isMongoId(),
        check('coleccion').custom(c => colecPermitidas(c, ['usuarios', 'productos'])),
        validarCampos
    ],
    actualizarImgCloudinary);
    //actualizarImagen);

router.get('/:coleccion/:id', [
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('coleccion').custom(c => colecPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen);


module.exports = router;