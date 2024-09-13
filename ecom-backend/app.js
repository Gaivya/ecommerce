const connectToMongo = require('./config');
const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const path = require('path');


const cart = require('./routes/cart');
const alluser=require("./routes/alluser")
const banner=require("./routes/banner");
const category=require("./routes/category")
const driver=require("./routes/driver")
const storedata=require("./routes/storedata")
const payment=require("./routes/payment")
const policies=require("./routes/policies")
const popupdata=require("./routes/popupdata")
const product=require("./routes/product")
const setting=require("./routes/setting")
const subcategory=require("./routes/subcategory")
const AdminRoute = require('./routes/Admin/AdminAuth')
const paymentmodedata = require('./routes/paymentmodedata');
const menu = require('./routes/menu ');
const city = require('./routes/cities');
const auth = require('./routes/auth');
const order=require("./routes/order")
// const wishlist = require('./routes/wishlist')
// const product = require('./routes/product')
// const review = require('./routes/review')
// //const paymentRoute = require('./routes/paymentRoute')
// const forgotPassword = require('./routes/forgotPassword')
 
const dotenv = require('dotenv');
const authenticateToken = require('./middleware/apiAuth');
const ordernumber = require('./routes/ordernumber');
const privacypolicy = require('./routes/privacypolicy');
const subscriber = require('./routes/subscriber');
const barcode_product = require('./routes/barcode_product');
const posConfig = require('./routes/pos');
const coupancode = require('./routes/coupan');
const contact = require('./routes/contactus');
dotenv.config()

connectToMongo();

const port = process.env.PORT || 5000

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.urlencoded({ extended: true }))



app.use(express.json())
app.use(cors());
// app.use(express.static(path.join(__dirname, '../adminfrontend/build')));
const staticToken = 'a1b2c3d4';








app.use('/api/cart',authenticateToken, cart)

app.use("/api/ordernumber",authenticateToken,ordernumber)

app.use('/api/alluser',authenticateToken, alluser)

app.use('/api/banner',authenticateToken, banner)

app.use('/api/category',authenticateToken, category)

app.use('/api/driver',authenticateToken, driver)

app.use('/api/driver',authenticateToken, driver)

app.use('/api/storedata',authenticateToken, storedata)

app.use('/api/payment',authenticateToken, payment)

app.use('/api/policies',authenticateToken, policies)

app.use('/api/popupdata',authenticateToken, popupdata)

app.use('/api/product',authenticateToken, product)

app.use('/api/setting',authenticateToken, setting)

app.use('/api/subcategory',authenticateToken, subcategory)

app.use('/api/admin',authenticateToken, AdminRoute)

app.use('/api/paymentmodedata',authenticateToken, paymentmodedata);

app.use('/api/menu',authenticateToken, menu);

app.use('/api/privacypolicy',authenticateToken, privacypolicy);

app.use('/api/subscriber',authenticateToken, subscriber);

app.use('/api/city',authenticateToken, city);

app.use('/api/auth',authenticateToken, auth)

app.use('/api/barcode',authenticateToken, barcode_product);

app.use('/api/findpos',authenticateToken, posConfig);

app.use('/api/getorderbystoreid',authenticateToken, order);

app.use('/api/coupan',authenticateToken, coupancode);

app.use('/api/addcontactus',authenticateToken, contact);

app.use('/api',authenticateToken, order);


//app.use(checkOrigin);

// app.use('/api/auth', auth)

// app.use('/api/product', product)

// app.use('/api/wishlist', wishlist)

// app.use('/api/review', review)

//app.use('/api', paymentRoute)

// app.use('/api/password', forgotPassword)

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../adminfrontend/build', 'index.html'));
//   });

app.listen(port, () => {
    console.log(`E-commerce backend listening at http://localhost:${port}`)
})
