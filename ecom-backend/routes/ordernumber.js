const express = require("express");
const router = express.Router();



let currentOrderNumber = 1;
let currentDate = new Date().toISOString().split('T')[0];

router.get('/', (req, res) => {
  const today = new Date().toISOString().split('T')[0];

  
  if (today !== currentDate) {
    currentOrderNumber = 1;
    currentDate = today;
  }

  
  const formattedOrderNumber = String(currentOrderNumber).padStart(4, '0');

 
  currentOrderNumber++;

  res.json({ orderNumber: formattedOrderNumber });
});


module.exports = router;
