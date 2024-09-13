const express = require('express');
const jwt = require("jsonwebtoken");
// const User = require('../../models/User');
const alluser = require("../../models/alluser")
const router = express.Router();
const bcrypt = require('bcrypt');
const authenticateToken=require("../../middleware/apiAuth")
const jwt_token=require("../../middleware/authAdmin")
const apiauthtoken=require("../../middleware/authAdmin")
// const authAdmin = require("../../middleware/authAdmin");
const { body, validationResult } = require('express-validator');
const dotenv = require('dotenv');
const {
    addProduct, addUser, addCategory, addDriver,
    addBanner, addpolicies, addpayment, addsetting, addstoredatas,
    deletebanner,
    deletecategory,
    deletedriver,
    deletesubcategory,
    deletepolicies,
    deleteproduct,
    deletepayment,
    deletesetting,
    deletestoredata,
    addNewPos,
    getallpos,
    findpos,
    updatePosConfigByMacAddress,
    updatealluser,
    updatebanner,
    updateCategory,
    updatesubcategory,
    updatedriver,
    updatepolicies,
    updateproduct,
    updatepayment,
    updatestoredatas,
    allorder,
    addorder,
    updateorder,
    deleteorder,
    addSubCategory,
    deleteUser,
    getuserbyid,
    getproductbyid,
    getorderbyid,
    getsubcategory,
    getcategorybyid,
    getsubcategorybyid,
    getdriverbyid,
    getbannerbyid,
    addcoupan,
    getcoupanbyid,
    deletecoupan,
    allcoupan,
    updatestatusalluser,
    updatestatusbanner,
    updatestatuscategory,
    updatestatuscoupan,
    updatestatusdriver,
    updatestatuspayment,
    updatestatuspolicies,
    updatestatusposconfig,
    updatestatusproduct,
    updatestatussubcategories,
    updatestatusstoredata,
    getalladmin, 
    getproductbystoreid,
    getorderbystoreid,
    getsubcategorybystoreid,
 
    updatecoupan,
    getorderbytype,
    getstore,
    addmenu,
    addprivacypolicy,
    updateprivacypolicy,
    addsubscriber,
    updatemenu,
    updatestatusstore,
    updatestatususer,
    getorderbyuserid,
    getpolicybyid,
    getproductbysidandscid,
    getSubCategorybySidandCid,
    getproductbysidandcid,
    updateuseraddress,
    getpaymentbyid,
    addContactus,
    } = require('../../controller/AdminControl');
const { chartData } = require('../../controller/AllProductInfo');
const { default: axios } = require('axios');
dotenv.config()



const staticToken = 'a1b2c3d4';


let success = false


const multer = require('multer');
const fs = require('fs');
const cors = require("cors");
const { adddailysummary, getalldailysummary } = require('../../controller/AdminPosControl');
const app = express();
app.use(cors())



router.use(authenticateToken);







router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),

], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() })
    }

    const { email, password } = req.body;
    try {
        let user = await alluser.findOne({ email });

 	if (!user) {
            return res.status(400).send({ success, error: "Invalid email or password" });
        }
	if (user.type !== "admin" || user.status !== "active") {
            return res.status(400).send({ success, error: "Invalid User" });
        }
	const passComp = await bcrypt.compare(password, user.password);
        if (!passComp) {
            return res.status(400).send({ success, error: "Invalid email or password" });
        }

        const data = {
            user: {
                id: user._id
            }
        };

        const authToken = jwt.sign(data, process.env.JWT_SECRET); // Ensure JWT_SECRET is set
        success = true;
        res.send({ success, authToken, userid: user._id });

     	}
    catch (error) {
        success = false
        res.status(500).send("Internal server error002")
    }
}
);


router.post('/register',

    body('first_name', 'Enter a valid name').isLength({ min: 3 }),
    body('last_name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/),
    body('mobile', 'Enter a valid phone number').isLength({ min: 10, max: 10 })


    , async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {

            return res.status(400).json({ error: errors.array() })

        }
        const userDetail = req.body;


        try {
            let user = await alluser.findOne({ $or: [{ email: userDetail.email }, { mobile: userDetail.mobile }] });
            console.log(userDetail)
            if (user) {
                success = false
                return res.status(400).send({ success, error: "Sorry a user already exists" })
            }
            else {

                try {

                    const salt = await bcrypt.genSalt(10);
                    userDetail.password = await bcrypt.hash(userDetail.password, salt);
                    await alluser.create({ ...userDetail })
                    res.send({success:true})
                } catch (error) {
                    console.log(error);
                    res.status(400).send(error)
                }
            }


        }
        catch (error) {
            res.status(500).send("Internal server error")
        }
    })


router.use(jwt_token);

router.get("/getallpos", getallpos)
router.get("/allorder", allorder)
router.get("/allcoupan", allcoupan)
router.get("/getalladmin", getalladmin)


const imageDir = '/var/www/html/images';
if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, imageDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });


app.use(express.static('public'));


router.post('/upload', upload.single('image'), (req, res) => {
    try {
        res.send({message:"Success"});
    } catch (err) {
        res.status(400).send('Error uploading image');
    }
});


router.get('/getaddress', async (req, res) => {
    const api = 'AIzaSyAcVwMXYKk8h9R7EffGqhSD4jcEnV1jxOE';
    const query = req.query.query;
  
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${api}`);
      const data = response.data;
      res.json(data);
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      res.status(500).json({ error: 'Error fetching address suggestions' });
    }
  });



router.post('/addproduct', addProduct);
router.post('/adduser',
    body('first_name', 'Enter a valid name').isLength({ min: 3 }),
    body('last_name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/),
    body('mobile', 'Enter a valid phone number').isLength({ min: 10, max: 10 })


    ,
    addUser);
router.post('/addcategory', addCategory);
router.post('/addsubcategory', addSubCategory);
router.post('/adddriver',
    body('first_name', 'Enter a valid name').isLength({ min: 3 }),
    body('last_name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/),
    body('mobile', 'Enter a valid phone number').isLength({ min: 10, max: 10 })
    , addDriver);
router.post('/addbanner', addBanner);
router.post('/addpolicies', addpolicies);
router.post('/addpayment', addpayment);
router.post('/addsetting', addsetting);
router.post('/addstoredata', addstoredatas);
router.post("/addnewpos", addNewPos);
router.post("/findpos", findpos)
router.post("/addorder", addorder)
router.post("/getsubcategory", getsubcategory)
router.post("/addcoupan", addcoupan)
router.post("/addmenu", addmenu)
router.post("/addprivacypolicy", addprivacypolicy)
router.post("/addsubscriber", addsubscriber)
router.post("/getpaymentbyid", getpaymentbyid)
router.post("/addcontactus", addContactus)




router.put("/findandupdatepos", updatePosConfigByMacAddress)
router.put("/updatealluser", updatealluser)
router.put("/updatebanner", updatebanner)
router.put("/updatecategory", updateCategory)
router.put("/updatesubcategory", updatesubcategory)
router.put("/updatedriver", updatedriver)
router.put("/updatepolicies", updatepolicies)
router.put("/updateproduct", updateproduct)
router.put("/updatepayment", updatepayment)
router.put("/updatestoredata", updatestoredatas)
router.put("/updateorder", updateorder)
router.put("/updatecoupan", updatecoupan)
router.put("/updateprivacypolicy", updateprivacypolicy)
router.put("/updatemenu", updatemenu)


router.patch("/updatestatusalluser", updatestatusalluser)
router.patch("/updatestatusbanner", updatestatusbanner)
router.patch("/updatestatuscategory", updatestatuscategory)
router.patch("/updatestatuscoupan", updatestatuscoupan)
router.patch("/updatestatusdriver", updatestatusdriver)
router.patch("/updatestatuspayment", updatestatuspayment)
router.patch("/updatestatuspolicies", updatestatuspolicies)
router.patch("/updatestatusposconfig", updatestatusposconfig)
router.patch("/updatestatusproduct", updatestatusproduct)
router.patch("/updatestatusproduct", updatestatusstoredata)
router.patch("/updatestatussubcategories", updatestatussubcategories)
router.patch("/updatestatusstore", updatestatusstore)
router.patch("/updatestatususer", updatestatususer)
router.patch("/updateuseraddress", updateuseraddress)






router.post("/getuserbyid",getuserbyid)
router.post("/getproductbyid", getproductbyid)
router.post("/getorderbyid", getorderbyid)
router.post("/getcategorybyid", getcategorybyid)
router.post("/getsubcategorybyid", getsubcategorybyid)
router.post("/getdriverbyid", getdriverbyid)
router.post("/getbannerbyid", getbannerbyid)
router.post("/getcoupanbyid", getcoupanbyid)
router.post("/getorderbystoreid", getorderbystoreid)
router.post("/getsubcategorybystoreid", getsubcategorybystoreid)
router.post('/deleteorder', deleteorder)
router.post('/getorderbytype', getorderbytype)
router.post('/getstore', getstore)
router.post("/getorderbyuserid",getorderbyuserid)
router.post("/getpolicybyid",getpolicybyid)
router.post("/getproductbyscid", getproductbysidandscid)
router.post("/getproductbystoreid", getproductbystoreid)
router.post("/getsubcategorybysidandcid", getSubCategorybySidandCid)
router.post("/getproductbycid", getproductbysidandcid)





// router.post('/uploadimage', authAdmin, uploadImage);
// router.post('/products/editlist', authAdmin, productsEditList);
// router.post('/categories/editlist', authAdmin, categoriesEditList);
// router.post('/subcategories/editlist', authAdmin, subCategoriesEditList);
// router.post('/drivers/editlist', authAdmin, driversEditList);
// router.post('/policypages/editlist', authAdmin, policyPageEditList);
// router.post('/general/editlist', authAdmin, generalEditList);
// router.post('/managepopup/editlist', authAdmin, managePopupEditList);
// router.post('/managewebsite/editlist', authAdmin, manageWebsiteEditList);
// router.post('/banner/editlist', authAdmin,bannerEditList)
// router.post('/admins/editlist', authAdmin,adminsEditList)





router.delete('/deleteuser', deleteUser)
router.delete('/deletebanner', deletebanner)
router.delete('/deletecategory', deletecategory)
router.delete('/deletedriver', deletedriver)
router.delete('/deletesubcategory', deletesubcategory)
router.delete('/deletepolicies', deletepolicies)
router.delete('/deleteproduct', deleteproduct)
router.delete('/deletepayment', deletepayment)
router.delete('/deletesetting', deletesetting)
router.delete('/deletestoredata', deletestoredata)
router.delete("/deletecoupan", deletecoupan)


// router.put('/updateproduct/:id', authAdmin, updateProductDetails)
// router.delete('/review/:id', authAdmin, deleteUserReview);
// router.delete('/usercart/:id', authAdmin, deleteUserCartItem);
// router.delete('/userwishlist/:id', authAdmin, deleteUserWishlistItem);
// router.delete('/deleteproduct/:id', authAdmin, deleteProduct);





module.exports = router