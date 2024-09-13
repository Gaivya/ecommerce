const express = require("express");
const router = express.Router();
const posConfig = require("../models/posConfig");


router.post("/",async (req, res) => {
    const data = req.body;

    try {
        const posSystem = await posConfig.findOne({ $or: [{ mac_address: data.mac_address }, { pos_name: data.pos_name }] });
        if (posSystem) {
            res.status(200).send(posSystem);
        } else {
            res.status(404).send({ msg: "mac_address and pos name system not found" });
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ msg: "Something went wrong, please try again later", error });
    }
});


module.exports = router;

