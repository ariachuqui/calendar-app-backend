const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar-jwt");
const { check } = require("express-validator");

const router = Router();

const {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento,
} = require("../controllers/events");
const {isDate} = require("../helper/isDate");
const { validarCampos } = require("../middlewares/validas-campos");

//Para que todas tengan una validación de JWT
router.use(validarJWT);

// Obtener eventos
router.get("/", getEventos);

// Crear evento
router.post(
    "/", 
    [
        check("title", "El titulo es obligatorio").not().isEmpty(),
        check("start", "La fecha de inicio es obligatoria").custom(isDate),
        check("end", "La fecha de inicio es obligatoria").custom(isDate),
        validarCampos
    ], 
    crearEvento);

// Actualizar evento
router.put("/:id", actualizarEvento);

// Borrar evento
router.delete("/:id", eliminarEvento);

module.exports = router;
