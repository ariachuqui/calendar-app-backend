const { Router } = require("express");
const { check } = require("express-validator");
const router = Router();

const {
    crearUsuario,
    loginUsario,
    revalidarToken,
} = require("../controllers/auth");

const { validarCampos } = require('../middlewares/validas-campos');
const { validarJWT } = require("../middlewares/validar-jwt");


router.post(
    "/",
    [
        check("email", "el email es obligatorio").isEmail(),
        check("password", "el password debe de ser de 6 caracteres").isLength({
            min: 6,
        }),
        validarCampos
    ],
    loginUsario
);

router.post(
    "/new",
    [
        check("name", "el nombre es obligatorio").not().isEmpty(),
        check("email", "el email es obligatorio").isEmail(),
        check("password", "el password debe de ser de 6 caracteres").isLength({
            min: 6,
        }),
        validarCampos
    ],
    crearUsuario
);

router.get("/renew",validarJWT ,revalidarToken);

module.exports = router;
