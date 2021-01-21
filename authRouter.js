const Router = require('express');
const router = new Router();
const controller = require('./authController');
const {check} = require('express-validator');

router.post('/register', [
    check('username', 'Имя пользователя не может быть пустым').notEmpty(),
    check('password', 'Пароль не может быть короче 4 символов').isLength({min: 4})
], controller.register);
router.post('/get_token', controller.getTokens);
router.post('/refresh', controller.refresh)

module.exports = router;
