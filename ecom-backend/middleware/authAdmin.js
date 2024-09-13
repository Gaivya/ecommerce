const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
// const User = require('../models/User.js');
const { default: axios } = require("axios");
const alluser = require("../models/alluser");
dotenv.config()

const checkAdmin = async (req, res, next) => {
    // get the user from the jwt token and id to req objectPosition: 
    const token = req.header('AuthToken');
    if (!token) {
        return res.status(401).send("Access denied")
    }
    try {
        const data = jwt.verify(token,process.env.JWT_SECRET )    //process.env.JWT_SECRET
     

        const getbyid = await alluser.findOne({ _id: data.user.id });
        
        console.log(getbyid.type)
        if(getbyid && getbyid.type==="admin"){
        
          next()
        }
        else{
          res.status(401).send("Access denied")
        }
        
       
        
        //   if(response.data.data && response.data.data[0].type=='admin'){
        //     next()
        //   }
        //   else {
            
        //     res.status(401).send("Access denied")
        // }
        
    } catch (error) {
        res.status(401).send("Access denied")

    }


}

module.exports = checkAdmin