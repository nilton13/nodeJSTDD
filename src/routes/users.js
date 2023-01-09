const express = require("express");

module.exports = (app) =>{

    const router = express.Router();

    router.get('/',(req,res) =>{
        app.services.user.findAll()
            .then(result => res.status(200).json(result))
    });
    
    router.post('/',async(req,res) =>{
        try{
            const result = await app.services.user.save(req.body);
            res.status(201).json(result[0]);
        }catch(err){
            return res.status(400).json({ error: err.message })
        }
    });

    return router;
}