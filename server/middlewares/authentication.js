const jwt = require('jsonwebtoken');
const usuario = require('../models/usuario');


//==============================
// Verificar Token
//==============================

let verificaToken = ( req, res, next) => {

    let token = req.get('token');

    jwt.verify( token, process.env.SEED, (err, decoded) =>{

        if ( err ){
            return res.status(401).json({
                    ok: false,
                    err: {
                        message: 'El Token es invalido'
                    }
            });
        }
        req.usuario = decoded.usuario;
        next();

    });

};

//==============================
// Verificar Admin Role
//==============================
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE'){
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: `El usuario${ usuario.nombre } no es administrador`
            }
        });
    }


};



module.exports = { 
    verificaToken,
    verificaAdmin_Role
    }