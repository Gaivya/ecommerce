const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

// get all cart products
router.get("/", async (req, res) => {
    try {
        const { url } = req;
        if (url.includes('#') || url.includes('?') || url.includes('&')) {
            return res.status(404).json({ "error": "Invalid API request" });
        }
       
        const cart = await Cart.find({});
        console.log('Cart items fetched successfully:', cart);
        res.send(cart);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).send("Internal server error");
    }
});

// Add item to cart
// router.post('/add', [
//     body('userId').isNumeric().withMessage('User ID must be a number'),
//     body('cartOrder').isArray().withMessage('Cart Order must be an array'),
//     body('cartOrder.*.cartItemId').isNumeric().withMessage('Cart Item ID must be a number'),
//     body('cartOrder.*.product').isString().withMessage('Product name must be a string'),
//     body('cartOrder.*.quantity').isNumeric().withMessage('Quantity must be a number'),
//     body('cartOrder.*.amount').isNumeric().withMessage('Amount must be a number')
// ], async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {zzz
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { userId, cartOrder } = req.body;

//     try {
//         const newCart = new Cart({
//             userId,
//             cartOrder
//         });

//         await newCart.save();
//         res.status(201).json({ success: true, message: 'Cart added successfully', cart: newCart });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Internal server error', error });
//     }
// });



router.delete("/delete", async (req, res) => {
    const { _id } = req.body;
    try {
        let deleteReview = await category.deleteOne({_id:_id})
        res.send({ msg: "deleted successfully"  })
    } catch (error) {
        res.status(400).send({ msg: "Something went wrong,Please try again letter", error })
    }
})

module.exports = router;
