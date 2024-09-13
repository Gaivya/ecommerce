const express = require("express");
const router = express.Router();
const Product = require("../models/Product");


router.post("/", async (req, res) => {
  try {

      const allowedParams = ['category'];
      const queryKeys = Object.keys(req.query);

      const invalidParams = queryKeys.filter(key => !allowedParams.includes(key));
      if (invalidParams.length > 0) {
          return res.status(400).json({ "error": "invalid param" });
      }




      const query = {};
    let Products;
      console.log(req.body)
      if (req.body.store_id) {
          query.store_id = req.body.store_id;
          if(req.query.category){
              query.category = req.query.category;
          }
           Products = await Product.find(query);
      }


    else{
         Products = await Product.find();
    }
      


      if ((Products.length === 0) || (req.url.includes('&') || req.url.includes('#'))) {
          return res.status(404).json({ "error": "No products found in this query" });
      }

      res.status(200).json(Products);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
  }

})



router.post("/getproductbystoreid",async (req, res) => {
  try {
      const { store_id } = req.body;

      const getbyid = await Product.find({ store_id: store_id });

      res.status(200).json(getbyid);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});





module.exports = router;
