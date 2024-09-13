const express = require("express");
const router = express.Router();
const barcodeproduct = require("../models/barcodeproduct");


router.get("/", async (req, res) => {
    try {
        const { url } = req;
        if (url.includes('#') || url.includes('?') || url.includes('&')) {
            return res.status(404).json({ "error": "Invalid API request" });
        }
        const data = await barcodeproduct.find();
       
        res.send(data)

    } catch (error) {
        console.log(error);
        res.status(400).send("Something went wrong")
    }
})

router.post("/add", async (req, res) => {
    const data = req.body;

    try {
        // Check if a product with the same barcode already exists
        const existingProduct = await barcodeproduct.findOne({ barcode: data.barcode });

        if (existingProduct) {
            return res.status(400).send({ message: 'Barcode already exists' });
        }

        // If no product with the same barcode exists, create a new product
        await barcodeproduct.create({ ...data });
        res.send({ message: 'Success' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal Server Error', error });
    }
});


router.post("/getbarcodeproductbyid", async (req, res) => {
    try {
        
        const { _id } = req.body;
        if (!_id) {
            return res.status(400).json({ error: "ID is required" });
        }
        const getbyid = await barcodeproduct.find({ _id: _id });
        res.status(200).json(getbyid);
        

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

router.post("/getproductbybarcode", async (req, res) => {
    try {
        
        const { barcode } = req.body;
        if (!barcode) {
            return res.status(400).json({ error: "barcode is required" });
        }
        const getbyid = await barcodeproduct.find({ barcode: barcode });
        res.status(200).json(getbyid);
        

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

router.post("/updatequantity", async (req, res) => {
    const { _id,stock_quantity } = req.body;
    try {
        
        const updatedConfig = await barcodeproduct.findOneAndUpdate(
            { _id: _id },
            { $set: { stock_quantity: stock_quantity } },
            { new: true }
        );

        if (!updatedConfig) {
            res.status(404).send({ msg: "not found" });
        }
        res.status(200).send({ success: true, msg: updatedConfig });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }

})

module.exports = router;
