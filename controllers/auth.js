const { response } = require("express");
const Usuario = require("../models/Usuario");
const bcrypt = require('bcryptjs');
const { generarJWT } = require("../helper/jwt");


const crearUsuario = async (req, res = response) => {
    const { name, email, password } = req.body;

    
    try {
        let usuario = await Usuario.findOne({email})

        if( usuario ) {
            return res.status(400).json({
                ok:false,
                msg: "Un usuario con este correo ya exite"
            })
        }
        
         
        usuario = new Usuario(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);
        
        
        await usuario.save();
        
        //Genrar Token
        const token = await generarJWT(usuario.id, usuario.name);


        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name,
            token
        })

    } catch (error) {
        
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: "por favor comunicarse con el administrador"
        })

    }

};

const loginUsario = async (req, res = response) => {
    const { name, email, password } = req.body;

    try {

        //Confirmar Email
        let usuario = await Usuario.findOne({email})

        if( !usuario ) {
            return res.status(400).json({
                ok:false,
                msg: "No existe usuario con este email"
            })
        }

        //Confirmar Password
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if ( !validPassword ) {

            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            })

        }

        // Generar nuevo JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });
        
    } catch (error) {
        
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: "por favor comunicarse con el administrador"
        })

    }

};

const revalidarToken = async(req, res = response) => {

    const uid = req.uid;
    const name = req.name;

    try {

        // Generar nuevo JWT
        const token = await generarJWT(uid, name);
    
        res.json({
            ok: true,
            token,
            uid,
            name
        });
        
    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: "Por favor comunicarse con el administrador",
        })
    }

};

module.exports = {
    crearUsuario,
    loginUsario,
    revalidarToken,
};
