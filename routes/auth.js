const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSingIn } = require('../controllers/Auth');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();

router.post('/login',
[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    validarCampos
]
, login);

router.post('/google',
[
    check('id_token', 'El Id token es necesario').notEmpty(),
    validarCampos
]
, googleSingIn);

module.exports = router;