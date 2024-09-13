const express = require("express");
const router = express.Router();
const popupdata = require("../models/popupdata");


router.get("/", async (req, res) => {
    try {
        const data = await popupdata.find();
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
