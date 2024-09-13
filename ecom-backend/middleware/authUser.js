const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config()

const fetchUser = (req, res, next) => {
    // get the user from the jwt token and id to req objectPosition: 
    const token = req.header('Authorization');
    // console.log("Token",token)
    if (!token) {
        return res.status(400).send("Access denied" )
    }
    try {
        const data = jwt.verify(token, "Krish@123")
        req.user = data.user
        console.log("Token Verified")
        next()
    } catch (error) {
        res.status(400).send( "Access denied" )

    }


}

module.exports = fetchUser