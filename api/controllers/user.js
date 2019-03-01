const mongoose = require('mongoose');
const bcrypt =  require('bcrypt');
const jwt =  require('jsonwebtoken');
const User = require('../models/user');
exports.user_signup =  (req, res, next)=>{
    User.find({email: req.body.email})
        .exec()
        .then(user =>{
            if(user.length >= 1){
                return res.status(409).json({
                    message: "Mail exists"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (error, hash)=>{
                    if(error){
                        
                        return res.status(500).json({
                            error
                        });
                    } else {
                        const user = new User({
                            _id: mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        })
                        user.save()
                        .then(result => {
                            console.log(result);
                            res.status(201).json({
                                message: 'User created'
                            });
                        })
                        .catch(error => {
                            console.log(error);
                            res.status(500).json({
                                error
                            });
                        });
                    }
                });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error
            });
        });
    
}
exports.user_login = (req, res, next)=>{
    User.find({
        email: req.body.email
    })
    .exec()
    .then(user =>{
        if(user.length < 1){
            return res.status(404).json({
                message: 'Mail not found, auth fail'
            })
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
            if(err){
                return res.status(401).json({
                    message: 'auth fail'
                });
            }
            if(result){
                const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                },
                'ImSoHandsome',
                {
                    expiresIn: '1h'
                }
                );
                return res.status(200).json({
                    message: 'auth successful',
                    token
                });
            }
            res.status(401).json({
                message: 'auth fail'
            });
        });
    })
    .catch(error => {
        res.status(500).json({
            error
        });
    });
};
exports.user_delete = (req, res, next)=>{
    User.remove({
        _id: req.params.userId
    })
    .exec()
    .then(result =>{
        res.status(200).json({
            message: 'User deleted'
        })
    })
    .catch(error => {
        res.status(500).json({
            error
        });
    });
}