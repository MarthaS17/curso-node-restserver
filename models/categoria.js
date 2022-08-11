const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        require: true
    },
    usuario: {
        type: Schema.Types.ObjectId,//definir la clave primaria
        ref: 'Usuario',
        require: true
    }
});

CategoriaSchema.methods.toJSON = function () {
    const { __v, estado, ...categoria } = this.toObject();//exluye __v y estado
    return categoria;
}

module.exports = model('Categoria', CategoriaSchema);