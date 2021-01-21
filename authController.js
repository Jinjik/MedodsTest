const User = require('./models/User');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

class authController {
    async register(req, res) {
        try {

            // Validate data from req
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({message: 'Невалидные данные', errors});
            }

            const {username, password} = req.body;

            // check username in db
            const candidate = await User.findOne({username});

            if (candidate) {
                return res.status(400).json({message: 'Пользователь уже сущесвтует'});
            }

            // hash password
            let hashPassword = bcrypt.hashSync(password, 7);
            const user = new User({username, password: hashPassword});

            // save new user
            await user.save();
            return res.json({message: 'Пользователь успешно зарегистрирован'});

        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Ошибка при регистрации'});
        }
    }

    async getTokens(req, res) {
        try {
            // find user
            const user_id = req.body.user_id;
            const user = await User.findById(mongoose.Types.ObjectId(user_id));

            if (!user) {
                res.status(400).json({message: 'Пользователь не найден'});
            }

            //create tokens
            const accesToken = jwt.sign({_id: user_id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '2h' ,algorithm: 'HS512'});
            const refreshToken = jwt.sign({_id: user_id}, process.env.REFRESH_TOKEN_SECRET);
            let hashRefreshToken = bcrypt.hashSync(refreshToken, 7);

            // save refresh token to db
            await User.findByIdAndUpdate(mongoose.Types.ObjectId(user_id), {$set: {refresh_token: hashRefreshToken}});

            return res.status(200).json({accessToken: accesToken, refreshToken: refreshToken});


        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Ошибка входа'});
        }
    }

    async refresh(req, res) {
        try {
            const {user_id, accessToken, refreshToken} = req.body;

            if (!accessToken && !refreshToken) {
                return res.status(403).json('Невозможно обновить токен!')
            }

            const user = await User.findOne(mongoose.Types.ObjectId(user_id));

            if (!bcrypt.compareSync(refreshToken, user.refresh_token)) {
                return res.status(403).json('Невозможно обновить токен!')
            }

            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user_id) => {
                if (!err) {
                    const token = jwt.sign({_id: user_id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '2h' ,algorithm: 'HS512'});
                    return res.status(200).json({accessToken: token, refreshToken: refreshToken});
                } else {
                    return res.status(403).json('Невозможно обновить токен!')
                }
            });


        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Ошибка входа'});
        }
    }
}

module.exports = new authController();
