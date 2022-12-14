const { Router } = require('express');
const { check } = require('express-validator');
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete } = require('../controllers/Usuarios');
const { esRolValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');
const {
   validarCampos,
   validarJWT,
   esAdminRole,
   tieneRole
} =require('../middlewares');
const router = Router();

router.get('/', usuariosGet);

router.put('/:id', [
   check('id', 'No es un ID valido').isMongoId(),
   check('id').custom(existeUsuarioPorId),
   check('rol').custom(esRolValido), //(rol) => esRolValido(rol)=esRolValido
   validarCampos
], usuariosPut)

router.post('/', [
   check('correo', 'El correo no es valido').isEmail(),
   check('correo').custom(emailExiste),   
   check('nombre', 'El nombre es obligatorio').not().isEmpty(),
   check('password', 'El password debe ser mas de 6 letras').isLength({ min: 6 }),
   // check('rol', 'No es un Rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
   //check('rol').custom((rol) => esRolValido(rol)),
   check('rol').custom(esRolValido), //(rol) => esRolValido(rol)=esRolValido
   validarCampos
], usuariosPost)

router.delete('/:id',
[
   validarJWT,
   //esAdminRole,
   tieneRole('ADMIN_ROLE', 'VENTAS_ROLES'),
   check('id', 'No es un ID valido').isMongoId(),
   check('id').custom(existeUsuarioPorId),
   validarCampos
]
, usuariosDelete)


module.exports = router;