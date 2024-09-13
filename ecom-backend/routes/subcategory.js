const express = require("express");
const router = express.Router();
const subcategory = require("../models/subcategories");


router.get("/", async (req, res) => {
    try {
        const { category } = req.query;

        let data;
        if (category) {
            data = await subcategory.find({ category: category.toUpperCase() });
        } else {
            data = await subcategory.find();
        }

        if ((subcategory.length === 0) || (req.url.includes('&') || req.url.includes('#'))) {
            return res.status(404).json({ "error": "No products found in this query" });
        }

        res.send(data);
    } catch (error) {
        console.log(error);
        res.status(400).send("Something went wrong");
    }
});



router.post("/getsubcategorybysidandcid",async (req, res) => {
    try {
        const { store_id,category} = req.body;

        if (!store_id && !category) {
            return res.status(400).json({ error: "Store ID and category is required" });
        }

        const getbyid = await subcategory.find({ store_id: store_id,category:category });

        res.status(200).json(getbyid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;
