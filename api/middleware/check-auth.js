const jwt = require('jsonwebtoken');

module.exports = (req, res, next)=>{
    
    try{
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        const decode = jwt.verify(token, 'ImSoHandsome');
        req.userData = decode;
        next();
    } catch (error){
        console.log(process.env.JWT_KEY);
        return res.status(401).json({
            message: 'Auth failed'
        })
    }
    

}