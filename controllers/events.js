const {response} = require('express');
const Evento = require('../models/Evento');

const getEventos = async(req, res = response) => {
    
    const eventos = await Evento.find().populate('user', 'name');

    res.json({
        ok:true,
        eventos
    })
};

const crearEvento = async(req, res = response) => {

    const evento = new Evento( req.body );

    try {
        evento.user = req.uid;

        const eventoGuardado = await evento.save();
        
        res.json({
            ok:true,
            evento: eventoGuardado
        })
    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

};

const actualizarEvento = async(req, res = response) => {

    const eventoId = req.params.id;

    const uid = req.uid;

    try {

        const evento = await Evento.findById( eventoId );

        if ( !evento ) {
            return res.status(404).json({
                ok:false,
                msg: 'El evento no existe'
            });
        }

        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok:false,
                msg: 'El usuario no tiene privilegios para modificar este evento.'
            })
        }

        const newEvent = {
            ...req.body,
            user: uid
        }

        const eventUpdated = await Evento.findByIdAndUpdate( eventoId, newEvent, { new: true } );

        res.json({
            ok:true,
            evento: eventUpdated
        })
        
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg: 'Por favor comunicarse con el administrador'
        })
        
    }

};

const eliminarEvento = async(req, res = response) => {
    const eventoId = req.params.id;

    const uid = req.uid;

    try {

        const evento = await Evento.findById( eventoId );

        if ( !evento ) {
            return res.status(404).json({
                ok:false,
                msg: 'El evento no existe'
            });
        }

        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok:false,
                msg: 'El usuario no tiene privilegios para modificar este evento.'
            })
        }

        const eventUpdated = await Evento.findByIdAndDelete( eventoId )

        res.json({
            ok:true,
            msg: 'Evento borrado exitosamente'
        })
        
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg: 'Por favor comunicarse con el administrador'
        });
        
    }
};




module.exports = { getEventos, crearEvento, actualizarEvento, eliminarEvento };