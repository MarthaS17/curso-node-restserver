const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nomb: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    stus: {
        type: Boolean,
        default: true,
        require: true
    },
    usuario: {
        type: Schema.Types.ObjectId,//definir la clave primaria
        ref: 'Usuario',
        require: true
    },
    prec: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        require: true
    },
    dscr: { type: String },
    disp: { type: Boolean, default: true},
    img: { type: String },
});

ProductoSchema.methods.toJSON = function () {
    const { __v, stus, ...producto } = this.toObject();//exluye __v y estado
    return producto;
}

module.exports = model('Producto', ProductoSchema);