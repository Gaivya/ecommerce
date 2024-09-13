// const User = require("../models/User");
const Cart = require("../models/Cart");
const Wishlist = require("../models/Wishlist");
const Review = require("../models/Review");
const Payment = require("../models/Payment")
const Product = require("../models/Product");
const { default: axios } = require("axios");


const chartData = async (req, res) => {
    try {
        // const cart = await Cart.find().populate("productId");
        // const wishlist = await Wishlist.find().populate("productId");

        // const payment = await Payment.find();
        const payment=await axios.get(`https://lavishlook.in/onlinestore/api/index.php/orders`,{
            headers: {
              'Basic': 123456789,
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          })

        // const product = await Product.find();
        const product=await axios.get(`https://lavishlook.in/onlinestore/api/index.php/products`,{
            headers: {
              'Basic': 123456789,
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          })
          const users=await axios.get(`https://lavishlook.in/onlinestore/api/index.php/users/getUsers`,{
            headers: {
              'Basic': 123456789,
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          })
          // console.log(users.data)
          const orderResponse = await axios.get('https://lavishlook.in/onlinestore/api/index.php/orders',  { headers: {
            'Basic': 123456789,
            'Content-Type': 'application/x-www-form-urlencoded'
          } });

        // const review = await Review.find();
        res.send({ review:{}, product:product.data.data,users:users.data.data, payment:payment.data.data, wishlist:{}, cart:{},orders: orderResponse.data.data, });
    } catch (error) {
        res.send(error);

    }
}
module.exports = { chartData }