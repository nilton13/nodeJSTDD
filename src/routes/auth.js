const express = require('express');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');
const ValidationError = require('../errors/ValidationError');

const secret = 'asjdhajsldmasldmasndandjasldk';

module.exports = (app) =>{
    const router = express.Router();

    router.post('/signin',(req,res,next) =>{
        app.services.user.findOne({ email: req.body.email })
            .then((user) =>{
                if(!user) res.status(400).json({ error: 'Usuário ou senha inválidos' });
                if(bcrypt.compareSync(req.body.password, user.password)){
                    const payload = {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    };

                    const token = jwt.encode(payload, secret);
 
                    res.status(200).json({ token });
                } else res.status(400).json({ error: 'Usuário ou senha inválidos' });
            }).catch(err => next(err));
    });

    router.post('/signup',async (req,res,next) =>{
        try{
            const result = await app.services.user.save(req.body);
            res.status(201).json(result[0]);
        }catch(err){
            return res.status(400).json({ error: err.message })
        }
    });


    return router; 
}