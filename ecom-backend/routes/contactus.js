const express = require("express");
const router = express.Router();
const contact = require("../models/contact_us");


router.post("/", async (req, res) => {
    const data = req.body;

    try {
      
        await contact.create({ ...data })
        res.send({ message: "Success" })

    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
})


// router.post("/addcontactus", async (req, res) => {
//     const data = req.body;

//     try {
      
//         await contact_us.create({ ...data })
//         res.send({ message: "Success" })

//     } catch (error) {
//         console.log(error);
//         res.status(400).send(error)
//     }
// })


module.exports = router;
