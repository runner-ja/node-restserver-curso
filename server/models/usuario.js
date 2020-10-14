const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['jefe','ADMIN_ROLE', 'SUPER_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un puesto válido'
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true,'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesaria']
    },
    img: {
        type: String,
        required: [false]
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.methods.toJSON = function() {

    let user = this;
    let userOb = user.toObject();
    delete userOb.password;
    return userOb;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico'});
module.exports = mongoose.model( 'Usuario', usuarioSchema );