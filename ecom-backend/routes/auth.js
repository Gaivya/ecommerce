const express = require('express');
const jwt = require("jsonwebtoken");
const router = express.Router();
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const authUser = require('../middleware/authUser');
const dotenv = require('dotenv');

const { default: axios } = require('axios');
const alluser = require('../models/alluser');
dotenv.config()


// create a user :post "/auth",!auth



router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),

], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() })
    }

    const { email, password } = req.body;
    try {
        let user = await alluser.findOne({ email });
	 if (!user) {
            return res.status(400).send({ success, error: "Invalid email or password" });
        }
	if (user.type !== "user" || user.status !== "active") {
            return res.status(400).send({ success, error: "Invalid User" });
        }
	const passComp = await bcrypt.compare(password, user.password);
        if (!passComp) {
            return res.status(400).send({ success, error: "Invalid email or password" });
        }
	const data = {
            user: {
                id: user._id
            }
        };

        const authToken = jwt.sign(data, process.env.JWT_SECRET); // Ensure JWT_SECRET is set
        success = true;
        res.send({ success, authToken, userid: user._id });

    }
    catch (error) {
        success = false
        res.status(500).send("Internal server error")
    }
}
);



router.post('/register',

    body('first_name', 'Enter a valid name').isLength({ min: 3 }),
    body('last_name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/),
    body('mobile', 'Enter a valid phone number').isLength({ min: 10, max: 10 })


    , async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {

            return res.status(400).json({ error: errors.array() })

        }
        const userDetail = req.body;


        try {
            let user = await alluser.findOne({ $or: [{ email: userDetail.email }, { mobile: userDetail.mobile }] });
            console.log(userDetail)
            if (user) {
                success = false
                return res.status(400).send({ success, error: "Sorry a user already exists" })
            }
           
           
            else {

                try {

                    const salt = await bcrypt.genSalt(10);
                    userDetail.password = await bcrypt.hash(userDetail.password, salt);
                    await alluser.create({ ...userDetail })
                    res.send({success:true})
                } catch (error) {
                    console.log(error);
                    res.status(400).send(error)
                }
            }


        }
        catch (error) {
            res.status(500).send("Internal server error")
        }
    })

module.exports = router