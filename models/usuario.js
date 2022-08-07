// {
//     nombre: 'ms',
//     correo: 'msaaa',
//     password: 'msaa',
//     img: 'msaaaaa',
//     rol: 'msaaaa',
//     estado: false,
//     google: false
// }

const { Schema, model } = require('mongoose');
const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'Es necesario un valor en este camopo']
    },
    correo: {
        type: String,
        required: [true, 'Es necesario un valor en este camopo'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Es necesario un valor en este camopo']
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        required: true,
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
});

UsuarioSchema.methods.toJSON = function () {
    const { __v, password, _id, ...usuario } = this.toObject();//exluye __v y password
    usuario.uid = _id;//cambia el campo de _id a uid en memoria
    return usuario;
}

module.exports = model('Usuario', UsuarioSchema);