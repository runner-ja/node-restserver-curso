const express = require('express');
let {verificaToken, verificaAdmin_Role} = require('../middlewares/authentication');
const productos = require('../models/productos');
let app = express();
let Producto = require('../models/productos');


//====================
// Obtener todos los productos
//====================
app.get('/productos', verificaToken, (req, res) =>{
    
    // traer todos los productos
    // populate: usuario categoria
    // paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);
    
    let limit = req.query.limit || 0;
    limit = Number(limit);

    Producto.find({disponible: true})
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, productos) =>{

        if (err) {
            return res.status(500).json({
                   ok: false,
                   err:{
                       message: 'Error del servidor'
                   }
            });
        }
       
        res.json({
            ok: true,
            productos
        });

    })
});

//====================
// Obtener un producto por ID
//====================
app.get('/productos/:id', verificaToken, (req, res) =>{

    // populate: usuario categoria
    let id = req.params.id;
    let body = req.body;
    
    Producto.findById(id)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'nombre')
    .exec ((err, productoDB) => {
        
        if (err) {
            return res.status(500).json({
                   ok: false,
                   err
            });
        }

        
        if (!productoDB) {
            return res.status(400).json({
                   ok: false,
                   err:{
                    message:`El producto con id ${id} no existe`
                   }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

//====================
// Buscar productos
//====================
app.get('/productos/buscar/:termino',verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({nombre: regex})
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                       ok: false,
                       err
                });
            }

            res.json({
                ok: true,
                productos
            });

        });
});
//====================
// Crear un producto
//====================/
app.post('/productos', verificaToken, (req, res) =>{
        //crear un producto
        // grabar usuario, categoria de las disponibles
    let body = req.body;
    let producto = new Producto({
            
            usuario: req.usuario._id,
            nombre: body.nombre,
            precioUni: body.precioUni,
            descripcion: body.descripcion,
            categoria: body.categoria
        });
    
        producto.save((err, productoDB) => {
    
            if (err) {
                return res.status(500).json({
                       ok: false,
                       err
                });
            }    
            
            res.status(201).json({
                ok: true,
                producto: productoDB
            });
    
        });
});

//====================
// Actualizar un producto
//====================
app.put('/productos/:id', verificaToken, (req, res) =>{

        //crear un producto
        // grabar usuario, categoria de las disponibles
        let id = req.params.id;
        let body = req.body;

        Producto.findById(id, (err, productoDB) => {

            if (err) {
                return res.status(500).json({
                       ok: false,
                       err
                });
            }    
            if (!productoDB) {
                return res.status(400).json({
                       ok: false,
                       err: {
                           message:`El producto con id ${id} no existe`
                       }
                });
            }   
            
            productoDB.nombre = body.nombre;
            productoDB.precioUni = body.precioUni;
            productoDB.categoria = body.categoria;
            productoDB.disponible = body.disponible;
            productoDB.descripcion = body.descripcion;

            productoDB.save((err, productoGuardado) => {
    
                if (err) {
                    return res.status(500).json({
                           ok: false,
                           err
                    });
                }    
                
                res.json({
                    ok: true,
                    producto: productoGuardado
                });        
            });
        });
});

//====================
// Borrar un producto
//====================
app.delete('/productos/:id', verificaToken, (req, res) =>{

    //borrado logico del producto
        // grabar usuario, categoria de las disponibles

        let id = req.params.id;
        Producto.findById(id, (err, productoDB) => {

            if (err) {
                return res.status(500).json({
                       ok: false,
                       err
                });
            }    

            if (!productoDB) {
                return res.status(500).json({
                       ok: false,
                       err:{
                        message:`El producto con id ${id} no existe`
                       }
                });
            } 
            
            productoDB.disponible = false;

            productoDB.save( (err, productoBorrado) => {

                if (err) {
                    return res.status(500).json({
                           ok: false,
                           err
                    });
                }    

                res.json({
                    ok: true,
                    producto: productoBorrado,
                    message: 'Producto borrado'
                });
            });
        });
});



module.exports = app;