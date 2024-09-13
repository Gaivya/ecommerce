const express = require("express");
const router = express.Router();
const order = require("../models/order");


router.post("/",async (req, res) => {
    try {
        const { store_id, start_date, end_date, order_type } = req.body;

        if (!store_id) {
            return res.status(400).json({ error: "Store ID is required" });
        }

        let query = { store_id: store_id };

        if (start_date && end_date) {
            query.date_time = {
                $gte: start_date,
                $lte: end_date
            };
        }

        if (order_type) {
            query.order_type = order_type;
        }
        console.log(query);
        const getbyid = await order.find(query);


        res.status(200).json(getbyid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
 );



 router.post("/addorder", async (req, res) => {
    const data = req.body;
    // console.log(req.body)
    try {
        const existingProduct = await order.findOne({ uid: data.uid });
        if (existingProduct) {
            return res.status(400).send({ message: "uid  number must be unique" });
        }
        if (!data.date_time) {
            data.date_time = new Date()
        } else {
            data.date_time = new Date(data.date_time)
        }
        await order.create({ ...data })
        // console.log("success")
        return res.send({ message: "Success" })
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
})


router.post("/deleteorder",async (req, res) => {
    const { _id, status } = req.body;

    if (!_id || !status) {
        return res.status(400).send({ success: false, msg: "Missing required fields _id and/or status" });
    }

    try {

        const Order = await order.findOne({ _id: _id });
        if (!Order) {
            return res.status(404).send({ success: false, msg: "Order not found" });
        }
        if (Order.status !== "HOLD") {
            return res.status(400).send({ success: false, msg: "Order status is not HOLD, cannot delete" });
        }
        await order.deleteOne({ _id: _id, status: "HOLD" });

        res.send({ success: true, msg: "Deleted successfully" });
    } catch (error) {
        res.status(500).send({ success: false, msg: "Something went wrong, please try again later", error });
    }
});




router.post("/getorderbyuserid", async (req, res) => {
    try {
        const { user_id } = req.body;

        const getbyid = await order.find({ user_id: user_id });

        res.status(200).json(getbyid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});




module.exports = router;
