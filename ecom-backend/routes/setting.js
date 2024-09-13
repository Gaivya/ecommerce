const express = require("express");
const router = express.Router();
const setting = require("../models/setting");


router.get("/", async (req, res) => {
    try {
        const data = await setting.find();
        // const response=await axios.get(`https://lavishlook.in/onlinestore/api/index.php/users/getUsers`,{
        //     headers: {
        //       'Basic': 123456789,
        //       'Content-Type': 'application/x-www-form-urlencoded'
        //     }
        //   })
        res.send(data)

    } catch (error) {
        console.log(error);
        res.status(400).send("Something went wrong")
    }
})

module.exports = router;
