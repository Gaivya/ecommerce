const alluser = require("../models/alluser");
const category = require("../models/category")
const subcategory = require("../models/subcategories")
const driver = require("../models/driver")
const Wishlist = require("../models/Wishlist");
const Review = require("../models/Review");
const Product = require("../models/Product");
const Payment = require("../models/Payment");
const { default: axios } = require("axios");
const banner = require("../models/banner");
const policies = require("../models/policies");
const setting = require("../models/setting");
const storedata = require("../models/storedata");
const posConfig = require("../models/posConfig");
const Order = require("../models/order");
const coupancode = require("../models/coupancode");
const { validationResult } = require("express-validator");
const menu = require("../models/menu");
const privacypolicy = require("../models/privacypolicy");
const subscriber = require("../models/subscriber");
const contact_us = require("../models/contact_us");
let success = false;



const allorder = async (req, res) => {
    try {
        const { url } = req;
        if (url.includes('#') || url.includes('?') || url.includes('&')) {
            return res.status(404).json({ "error": "Invalid API request" });
        }
        const data = await Order.find();
        res.send(data)

    } catch (error) {
        console.log(error);
        res.status(400).send("Something went wrong")
    }
}



const addProduct = async (req, res) => {
    const data = req.body;

    try {
        const existingProduct = await Product.findOne({ name: data.name });
        if (existingProduct) {
            return res.status(400).send({ message: "Product name must be unique" });
        }
        await Product.create({ ...data })
        res.send({ message: "Success" })

    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
}


const addContactus = async (req, res) => {
    const data = req.body;

    try {
      
        await contact_us.create({ ...data })
        res.send({ message: "Success" })

    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
}


const addUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        return res.status(400).json({ error: errors.array() })

    }
    const data = req.body;
    try {
        const existingUser = await alluser.findOne({ $or: [{ email: data.email }, { mobile: data.mobile }] });
        if (existingUser) {
            return res.status(400).send({ message: "User email and password must be unique" });
        }
        await alluser.create({ ...data })
        res.send()
        console.log("sucess")

    } catch (error) {
        // console.log(error);
        return res.status(400).send(error)
    }
}
const addCategory = async (req, res) => {
    const data = req.body;
    try {

        const existingCategory = await category.findOne({ name: data.name });
        if (existingCategory) {
            return res.status(400).send({ message: "Category name must be unique" });
        }
        await category.create({ ...data })
        res.send({ message: "Success" })

    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
}


const addsubscriber = async (req, res) => {
    const data = req.body;
    try {

      
        await subscriber.create({ ...data })
        res.send({ message: "Success" })

    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
}

const addmenu = async (req, res) => {
    const data = req.body;
    try {

        await menu.create({ ...data })
        res.send({ message: "Success" })

    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
}


const addSubCategory = async (req, res) => {
    const data = req.body;
    try {
        const existingCategory = await subcategory.findOne({ name: data.name });
        if (existingCategory) {
            return res.status(400).send({ message: "Subcategory name must be unique" });
        }
        await subcategory.create({ ...data })
        res.send({ message: "Success" })
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
}

const getsubcategory = async (req, res) => {
    try {
        const { name } = req.body;
        const subcategories = await subcategory.find({ name: new RegExp(name, 'i') });

        res.status(200).json(subcategories);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving category and subcategories', error: error.message });
    }
};




const getsubcategorybycategory = async (req, res) => {
    try {
        const { category } = req.body;
        const subcategories = await subcategory.find({ category: category });

        res.status(200).json(subcategories);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving category and subcategories', error: error.message });
    }
};


const getalladmin = async (req, res) => {
    try {
        const { url } = req;
        if (url.includes('#') || url.includes('?') || url.includes('&')) {
            return res.status(404).json({ "error": "Invalid API request" });
        }
        const users = await alluser.find({ type: 'admin' });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users', error: error.message });
    }
};

const addDriver = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        return res.status(400).json({ error: errors.array() })

    }
    const data = req.body;
    try {

        const existingDriver = await driver.findOne({ $or: [{ email: data.email }, { mobile: data.mobile }] });
        if (existingDriver) {
            return res.status(400).send({ message: "Driver email and mobile must be unique" });
        }
        await driver.create({ ...data })
        res.send({ message: "Success" })
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
}



const addBanner = async (req, res) => {
    const data = req.body;
    try {

        await banner.create({ ...data })

        res.send({ message: "Success" })
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
}


const addorder = async (req, res) => {
    const data = req.body;
    // console.log(req.body)
    try {
        const existingProduct = await Order.findOne({ uid: data.uid });
        if (existingProduct) {
            return res.status(400).send({ message: "uid  number must be unique" });
        }
        if (!data.date_time) {
            data.date_time = new Date()
        } else {
            data.date_time = new Date(data.date_time)
        }
        await Order.create({ ...data })
        // console.log("success")
        return res.send({ message: "Success" })
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
}


const addpolicies = async (req, res) => {
    const data = req.body;
    try {
        const existingProduct = await policies.findOne({ name: data.name });
        if (existingProduct) {
            return res.status(400).send({ message: "policies name must be unique" });
        }
        await policies.create({ ...data })
        console.log("success")
        res.send({ message: "Success" })
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
}


const addpayment = async (req, res) => {
    const data = req.body;
    try {
        await Payment.create({ ...data })
        console.log("success")
        res.send({ message: "Success" })
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
}


const addsetting = async (req, res) => {
    const data = req.body;
    try {
        await setting.create({ ...data })
        console.log("success")
        res.send({ message: "Success" })
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
}


const addstoredatas = async (req, res) => {
    const data = req.body;
    try {
        await storedata.create({ ...data })
        console.log("success")
        res.send({ message: "Success" })
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
}


const addNewPos = async (req, res) => {
    const data = req.body;
    try {
        const existingProduct = await posConfig.findOne({ $or: [{ mac_address: data.mac_address }, { pos_name: data.pos_name }] });
        if (existingProduct) {
            return res.status(400).send({ message: "posConfig name or mac_address must be unique" });
        }
        await posConfig.create({ ...data })

        res.send({ message: "Success" })
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
}

const getallpos = async (req, res) => {
    try {
        const { url } = req;
        if (url.includes('#') || url.includes('?') || url.includes('&')) {
            return res.status(404).json({ "error": "Invalid API request" });
        }
        const data = await posConfig.find();
        res.send(data)

    } catch (error) {
        console.log(error);
        res.status(400).send("Something went wrong")
    }
}

const findpos = async (req, res) => {
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
};




const getpaymentbyid = async (req, res) => {
    try {
        const { _id } = req.body;

        const getbyid = await Payment.find({ _id: _id });


        res.status(200).json(getbyid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};





const updatePosConfigByMacAddress = async (req, res) => {
    const { mac_address } = req.body;
    try {

        const updatedConfig = await posConfig.findOneAndUpdate(
            { mac_address: mac_address },
            { $set: req.body },
            { new: true }
        );
        console.log(updatedConfig)
        if (!updatedConfig) {
            res.status(404).send({ msg: "POS system not found" });
        }
        res.status(200).send({ success: true, msg: updatedConfig });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }

}


const updatealluser  = async (req, res) => {
    const { _id } = req.body;
    try {

        const updatedConfig = await alluser.findOneAndUpdate(
            { _id: _id },
            { $set: req.body },
            { new: true }
        );
        console.log(updatedConfig)
        if (!updatedConfig) {
            res.status(404).send({ msg: "not found" });
        }
        res.status(200).send({ success: true, msg: updatedConfig });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }

}



const updatebanner = async (req, res) => {
    const { _id } = req.body;
    try {

        const updatedConfig = await banner.findOneAndUpdate(
            { _id: _id },
            { $set: req.body },
            { new: true }
        );
        console.log(updatedConfig)
        if (!updatedConfig) {
            res.status(404).send({ msg: "not found" });
        }
        res.status(200).send({ success: true, msg: updatedConfig });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }

}



const updateCategory = async (req, res) => {
    const { _id, name } = req.body;

    try {
        const existingCategory = await category.findOne({ name: name });
      
        console.log(req.body)
        const updatedConfig = await category.findOneAndUpdate(
            { _id: _id },
            { $set: req.body },
            { new: true }
        );
        console.log(updatedConfig)
        if (!updatedConfig) {
            res.status(404).send({ msg: "Category Not Found" });
        }
        res.status(200).send({ success: true, msg: updatedConfig });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }

}



const updatemenu = async (req, res) => {
    const { _id} = req.body;

    try {
        const updatedConfig = await menu.findOneAndUpdate(
            { _id: _id },
            { $set: req.body },
            { new: true }
        );
        console.log(updatedConfig)
        if (!updatedConfig) {
            res.status(404).send({ msg: "menu Not Found" });
        }
        res.status(200).send({ success: true, msg: updatedConfig });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }

}


const updateprivacypolicy = async (req, res) => {
    const { _id} = req.body;

    try {
        console.log(req.body)
        const updatedConfig = await policies.findOneAndUpdate(
            { _id: _id },
            { $set: req.body },
            { new: true }
        );
        console.log(updatedConfig)
        if (!updatedConfig) {
            res.status(404).send({ msg: "privacypolicy Not Found" });
        }
        res.status(200).send({ success: true, msg: updatedConfig });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }

}


const updatesubcategory = async (req, res) => {
    const { _id } = req.body;
    try {
        const existingCategory = await subcategory.findOne({ name: _id });

        if (existingCategory) {
            return res.status(400).send({ message: "Subcategory name must be unique" });
        }
        const updatedConfig = await subcategory.findOneAndUpdate(
            { _id: _id },
            { $set: req.body },
            { new: true }

        );
        if (!updatedConfig) {
            res.status(404).send({ msg: "not found" });
        }
        res.status(200).send({ success: true, msg: updatedConfig });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }

}


const updatedriver = async (req, res) => {
    const { _id } = req.body;
    try {
        const existingDriver = await driver.findOne({ name: _id });
        // if (existingDriver) {
        //     return res.status(400).send({ message: "Driver email and mobile must be unique" });
        // }
        const updatedConfig = await driver.findOneAndUpdate(
            { _id: _id },
            { $set: req.body },
            { new: true }
        );

        if (!updatedConfig) {
            res.status(404).send({ msg: "not found" });
        }
        res.status(200).send({ success: true, msg: updatedConfig });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }

}



const updatepolicies = async (req, res) => {
    const { _id } = req.body;
    try {

        const updatedConfig = await policies.findOneAndUpdate(
            { _id: _id },
            { $set: req.body },
            { new: true }
        );
        console.log(updatedConfig)
        if (!updatedConfig) {
            res.status(404).send({ msg: "not found" });
        }
        res.status(200).send({ success: true, msg: updatedConfig });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }

}


const updateproduct = async (req, res) => {
    const { _id, name } = req.body;
    try {
       
        const updatedConfig = await Product.findOneAndUpdate(
            { _id: _id },
            { $set: req.body },
            { new: true }
        );
        console.log(updatedConfig)
        if (!updatedConfig) {
            res.status(404).send({ msg: "not found" });
        }
        res.status(200).send({ success: true, msg: updatedConfig });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }

}


const updatepayment = async (req, res) => {
    const { _id } = req.body;
    try {

        const updatedConfig = await Payment.findOneAndUpdate(
            { _id: _id },
            { $set: req.body },
            { new: true }
        );
        console.log(updatedConfig)
        if (!updatedConfig) {
            res.status(404).send({ msg: "not found" });
        }
        res.status(200).send({ success: true, msg: updatedConfig });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }

}


const updatestoredatas = async (req, res) => {
    const { _id } = req.body;
    try {

        const updatedConfig = await storedata.findOneAndUpdate(
            { _id: _id },
            { $set: req.body },
            { new: true }
        );
        console.log(updatedConfig)
        if (!updatedConfig) {
            res.status(404).send({ success: false, msg: "not found" });
        }
        res.status(200).send({ success: true, msg: updatedConfig });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }

}


const updateorder = async (req, res) => {
    const { _id } = req.body;
    try {

        const updatedConfig = await Order.findOneAndUpdate(
            { _id: _id },
            { $set: req.body },
            { new: true }
        );
        console.log(updatedConfig)
        if (!updatedConfig) {
            res.status(404).send({ msg: "not found" });
        }
        res.status(200).send({ success: true, msg: updatedConfig });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }

}


const updatecoupan = async (req, res) => {
    const { _id } = req.body;

    try {

        const updatedConfig = await coupancode.findOneAndUpdate(
            { _id: _id },
            { $set: req.body },
            { new: true }
        );

        if (!updatedConfig) {
            res.status(404).send({ msg: "not found" });
        }
        res.status(200).send({ success: true, msg: updatedConfig });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }

}



const updatestatusalluser = async (req, res) => {
    const { _id, status } = req.body;
    try {
        if (!_id || !status) {
            return res.status(400).send({ success: false, message: "Mobile number and status are required" });
        }

        const updatedConfig = await alluser.findOneAndUpdate(
            { _id: _id },
            { $set: { status: status } },
            { new: true }
        );

        if (!updatedConfig) {
            return res.status(404).send({ msg: "User not found" });
        }

        res.status(200).send({ success: true, msg: updatedConfig });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}



const updatestatusbanner = async (req, res) => {
    const { _id, status } = req.body;
    try {
        if (!_id || !status) {
            return res.status(400).send({ success: false, message: "Mobile number and status are required" });
        }

        const updatedConfig = await banner.findOneAndUpdate(
            { _id: _id },
            { $set: { status: status } },
            { new: true }
        );

        if (!updatedConfig) {
            return res.status(404).send({ msg: "User not found" });
        }

        res.status(200).send({ success: true, msg: updatedConfig });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}




const updatestatuscategory = async (req, res) => {
    const { name, status } = req.body;
    try {
        if (!name || !status) {
            return res.status(400).send({ success: false, message: "id or status required" });
        }

        const updatedConfig = await category.findOneAndUpdate(
            { name: name },
            { $set: { status: status } },
            { new: true }
        );
        console.log(updatedConfig, "cate")
        if (!updatedConfig) {
            return res.status(404).send({ msg: "User not found" });
        }

        res.status(200).send({ success: true, msg: updatedConfig });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}




const updatestatuscoupan = async (req, res) => {
    const { _id, status } = req.body;
    try {
        if (!_id || !status) {
            return res.status(400).send({ success: false, message: "Mobile number and status are required" });
        }

        const updatedConfig = await coupancode.findOneAndUpdate(
            { _id: _id },
            { $set: { status: status } },
            { new: true }
        );

        if (!updatedConfig) {
            return res.status(404).send({ msg: "User not found" });
        }

        res.status(200).send({ success: true, msg: updatedConfig });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}




const updatestatusdriver = async (req, res) => {
    const { _id, status } = req.body;
    try {
        if (!_id || !status) {
            return res.status(400).send({ success: false, message: "Mobile number and status are required" });
        }

        const updatedConfig = await driver.findOneAndUpdate(
            { _id: _id },
            { $set: { status: status } },
            { new: true }
        );

        if (!updatedConfig) {
            return res.status(404).send({ msg: "User not found" });
        }

        res.status(200).send({ success: true, msg: updatedConfig });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}



const updatestatuspayment = async (req, res) => {
    const { _id, status } = req.body;
    try {
        if (!_id || !status) {
            return res.status(400).send({ success: false, message: "Mobile number and status are required" });
        }

        const updatedConfig = await Payment.findOneAndUpdate(
            { _id: _id },
            { $set: { status: status } },
            { new: true }
        );

        if (!updatedConfig) {
            return res.status(404).send({ msg: "User not found" });
        }

        res.status(200).send({ success: true, msg: updatedConfig });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}



const updatestatuspolicies = async (req, res) => {
    const { _id, status } = req.body;
    try {
        if (!_id || !status) {
            return res.status(400).send({ success: false, message: "Mobile number and status are required" });
        }

        const updatedConfig = await policies.findOneAndUpdate(
            { _id: _id },
            { $set: { status: status } },
            { new: true }
        );

        if (!updatedConfig) {
            return res.status(404).send({ msg: "User not found" });
        }

        res.status(200).send({ success: true, msg: updatedConfig });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}



const updatestatusposconfig = async (req, res) => {
    const { _id, status } = req.body;
    try {
        if (!_id || !status) {
            return res.status(400).send({ success: false, message: "id and status are required" });
        }

        const updatedConfig = await posConfig.findOneAndUpdate(
            { _id: _id },
            { $set: { status: status } },
            { new: true }
        );

        if (!updatedConfig) {
            return res.status(404).send({ msg: "User not found" });
        }

        res.status(200).send({ success: true, msg: updatedConfig });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}



const updateuseraddress = async (req, res) => {
    const { _id, address } = req.body;
    try {
        if (!_id || !address) {
            return res.status(400).send({ success: false, message: "id and address are required" });
        }

        const updatedConfig = await alluser.findOneAndUpdate(
            { _id: _id },
            { $set: { address: address } },
            { new: true }
        );

        if (!updatedConfig) {
            return res.status(404).send({ msg: "User not found" });
        }

        res.status(200).send({ success: true, msg: updatedConfig });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

   
const updatestatusstore = async (req, res) => {
    const { _id, status } = req.body;
    try {
        if (!_id || !status) {
            return res.status(400).send({ success: false, message: "id and status are required" });
        }

        const updatedConfig = await storedata.findOneAndUpdate(
            { _id: _id },
            { $set: { status: status } },
            { new: true }
        );

        if (!updatedConfig) {
            return res.status(404).send({ msg: "store not found" });
        }

        res.status(200).send({ success: true, msg: updatedConfig });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}



const updatestatususer = async (req, res) => {
    const { _id, status } = req.body;
    try {
        if (!_id || !status) {
            return res.status(400).send({ success: false, message: "id and status are required" });
        }

        const updatedConfig = await alluser.findOneAndUpdate(
            { _id: _id },
            { $set: { status: status } },
            { new: true }
        );

        if (!updatedConfig) {
            return res.status(404).send({ msg: "User not found" });
        }

        res.status(200).send({ success: true, msg: updatedConfig });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}






const updatestatusproduct = async (req, res) => {
    const { _id, status } = req.body;
    try {
        if (!_id || !status) {
            return res.status(400).send({ success: false, message: "Mobile number and status are required" });
        }

        const updatedConfig = await Product.findOneAndUpdate(
            { _id: _id },
            { $set: { status: status } },
            { new: true }
        );
        // console.log(updatedConfig, "pro")
        if (!updatedConfig) {
            return res.status(404).send({ msg: "User not found" });
        }

        res.status(200).send({ success: true, msg: updatedConfig });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}



const updatestatusstoredata = async (req, res) => {
    const { _id, status } = req.body;
    try {
        if (!_id || !status) {
            return res.status(400).send({ success: false, message: "Mobile number and status are required" });
        }

        const updatedConfig = await storedata.findOneAndUpdate(
            { _id: _id },
            { $set: { status: status } },
            { new: true }
        );

        if (!updatedConfig) {
            return res.status(404).send({ msg: "User not found" });
        }

        res.status(200).send({ success: true, msg: updatedConfig });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}



const updatestatussubcategories = async (req, res) => {
    const { _id, status } = req.body;
    try {
        if (!_id || !status) {
            return res.status(400).send({ success: false, message: "Mobile number and status are required" });
        }

        const updatedConfig = await subcategory.findOneAndUpdate(
            { _id: _id },
            { $set: { status: status } },
            { new: true }
        );

        if (!updatedConfig) {
            return res.status(404).send({ msg: "User not found" });
        }

        res.status(200).send({ success: true, msg: updatedConfig });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}





const deleteUser = async (req, res) => {
    const { mobile } = req.body;
    try {
        let deleteReview = await alluser.deleteOne({ mobile: mobile })

    } catch (error) {
        res.status(400).send({ msg: "Something went wrong,Please try again letter", error })
    }
}



const getuserbyid = async (req, res) => {
    try {
        const { _id } = req.body;

        const getbyid = await alluser.find({ _id: _id });

        res.status(200).json(getbyid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const getproductbyid = async (req, res) => {
    try {
        const { _id } = req.body;

        const getbyid = await Product.find({ _id: _id });

        res.status(200).json(getbyid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
const getproductbysidandcid = async (req, res) => {
    try {
        const { store_id,category } = req.body;

        const getbyid = await Product.find({ store_id: store_id ,category:category});

        res.status(200).json(getbyid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getproductbystoreid = async (req, res) => {
    try {
        const { store_id } = req.body;

        const getbyid = await Product.find({ store_id: store_id });

        res.status(200).json(getbyid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const getproductbysidandscid = async (req, res) => {
    try {
        const { store_id,subcategory } = req.body;

        const getbyid = await Product.find({ store_id: store_id ,subcategory:subcategory});

        res.status(200).json(getbyid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getSubCategorybySidandCid = async (req, res) => {
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
};


const getorderbyid = async (req, res) => {
    try {
        const { _id } = req.body;

        const getbyid = await Order.find({ _id: _id });

        res.status(200).json(getbyid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};





const getorderbyuserid = async (req, res) => {
    try {
        const { user_id } = req.body;

        const getbyid = await Order.find({ user_id: user_id });

        res.status(200).json(getbyid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



const getorderbystoreid = async (req, res) => {
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
        const getbyid = await Order.find(query);


        res.status(200).json(getbyid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const getpolicybyid = async (req, res) => {
    try {
        const { _id } = req.body;

        const getbyid = await policies.find({ _id: _id });

        // if(getbyid.length === 0)
        //    return res.status(400).json({msg:"policy not found"})
        
        res.status(200).json(getbyid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



const getstore = async (req, res) => {
    try {
        const { uid } = req.body;

        const getbyid = await storedata.find({ uid: uid });

        if(getbyid.length === 0)
           return res.status(400).json({msg:"uid not found"})

        res.status(200).json(getbyid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



const getorderbytype = async (req, res) => {
    try {
        const { uid } = req.body;

        const getbyid = await Order.find({ uid: uid });

        res.status(200).json(getbyid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};




const getcategorybyid = async (req, res) => {
    try {
        const { name } = req.body;

        const getbyid = await category.find({ name: name });

        res.status(200).json(getbyid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};








const getsubcategorybyid = async (req, res) => {
    try {
        const { _id } = req.body;

        const getbyid = await subcategory.find({ _id: _id });

        res.status(200).json(getbyid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const getsubcategorybystoreid = async (req, res) => {
    try {
        const { store_id } = req.body;

        if (!store_id) {
            return res.status(400).json({ error: "Store ID is required" });
        }

        const getbyid = await subcategory.find({ store_id: store_id });

        res.status(200).json(getbyid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



const getdriverbyid = async (req, res) => {
    try {
        const { _id } = req.body;

        const getbyid = await driver.find({ _id: _id });

        res.status(200).json(getbyid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const getbannerbyid = async (req, res) => {
    try {
        const { _id } = req.body;

        const getbyid = await banner.find({ _id: _id });


        res.status(200).json(getbyid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



const deletebanner = async (req, res) => {
    const { _id } = req.body;
    try {
        let deleteReview = await banner.deleteOne({ _id: _id })
        res.send({ msg: "deleted successfully" })
    } catch (error) {
        res.status(400).send({ msg: "Something went wrong,Please try again letter", error })
    }
}


const deletecategory = async (req, res) => {
    const { name } = req.body;
    try {
        let deleteReview = await category.deleteOne({ name: name })
        res.send({ msg: "deleted successfully" })
    } catch (error) {
        res.status(400).send({ msg: "Something went wrong,Please try again letter", error })
    }
}


const deletedriver = async (req, res) => {
    const { mobile } = req.body;
    try {
        let deleteReview = await driver.deleteOne({ mobile: mobile })
        res.send({ msg: "deleted successfully" })
    } catch (error) {
        res.status(400).send({ msg: "Something went wrong,Please try again letter", error })
    }
}


const deletesubcategory = async (req, res) => {
    const { name } = req.body;
    try {
        let deleteReview = await subcategory.deleteOne({ name: name })
        res.send({ msg: "deleted successfully" })
    } catch (error) {
        res.status(400).send({ msg: "Something went wrong,Please try again letter", error })
    }
}


const deletepolicies = async (req, res) => {
    const { name } = req.body;
    try {
        let deleteReview = await policies.deleteOne({ name: name })
        res.send({ msg: "deleted successfully" })
    } catch (error) {
        res.status(400).send({ msg: "Something went wrong,Please try again letter", error })
    }
}


const deleteproduct = async (req, res) => {
    const { name } = req.body;
    try {
        let deleteReview = await Product.deleteOne({ name: name })
        res.send({ msg: "deleted successfully" })
    } catch (error) {
        res.status(400).send({ msg: "Something went wrong,Please try again letter", error })
    }
}


const deletepayment = async (req, res) => {
    const { name } = req.body;
    try {
        let deleteReview = await Payment.deleteOne({ name: name })
        res.send({ msg: "deleted successfully" })
    } catch (error) {
        res.status(400).send({ msg: "Something went wrong,Please try again letter", error })
    }
}


const deletesetting = async (req, res) => {
    const { name } = req.body;
    try {
        let deleteReview = await setting.deleteOne({ name: name })
        res.send({ msg: "deleted successfully" })
    } catch (error) {
        res.status(400).send({ msg: "Something went wrong,Please try again letter", error })
    }
}


const deletestoredata = async (req, res) => {
    const { name } = req.body;
    try {
        let deleteReview = await storedata.deleteOne({ name: name })
        res.send({ msg: "deleted successfully" })
    } catch (error) {
        res.status(400).send({ msg: "Something went wrong,Please try again letter", error })
    }
}


const deleteorder = async (req, res) => {
    const { _id, status } = req.body;

    if (!_id || !status) {
        return res.status(400).send({ success: false, msg: "Missing required fields _id and/or status" });
    }

    try {

        const order = await Order.findOne({ _id: _id });
        if (!order) {
            return res.status(404).send({ success: false, msg: "Order not found" });
        }
        if (order.status !== "HOLD") {
            return res.status(400).send({ success: false, msg: "Order status is not HOLD, cannot delete" });
        }
        await Order.deleteOne({ _id: _id, status: "HOLD" });

        res.send({ success: true, msg: "Deleted successfully" });
    } catch (error) {
        res.status(500).send({ success: false, msg: "Something went wrong, please try again later", error });
    }
};




const allcoupan = async (req, res) => {
    try {
        const { url } = req;
        if (url.includes('#') || url.includes('?') || url.includes('&')) {
            return res.status(404).json({ "error": "Invalid API request" });
        }
        const data = await coupancode.find();
        res.send(data)

    } catch (error) {
        console.log(error);
        res.status(400).send("Something went wrong")
    }
}


const deletecoupan = async (req, res) => {
    const { _id } = req.body;
    try {
        let deleteReview = await coupancode.deleteOne({ _id: _id })
        res.send({ msg: "deleted successfully" })
    } catch (error) {
        res.status(400).send({ msg: "Something went wrong,Please try again letter", error })
    }
}


const addcoupan = async (req, res) => {
    const data = req.body;
    try {
        await coupancode.create({ ...data })

        res.send({ message: 'Success' })
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
}

const addprivacypolicy = async (req, res) => {
    const data = req.body;
    try {
        await policies.create({ ...data })

        res.send({ message: 'Success' })
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
}



const getcoupanbyid = async (req, res) => {
    try {
        console.log(req.body);

        const { _id } = req.body;
        console.log(_id);

        if (!_id) {
            return res.status(400).json({ error: "ID is required" });
        }

        const getbyid = await coupancode.find({ _id: _id });
        res.status(200).json(getbyid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    deletebanner,
    addBanner,
    addpolicies, addpayment, addsetting, addstoredatas,
    addProduct, addUser, addSubCategory,
    addCategory, addDriver, deletecategory, deletedriver,
    deletesubcategory, deletepolicies, deleteproduct, deletepayment, deletesetting, deletestoredata, addNewPos,
    getallpos, findpos, updatePosConfigByMacAddress, updatealluser, updatebanner, updateCategory, updatesubcategory,
    updatedriver, updatepolicies, updateproduct, updatepayment, updatestoredatas, allorder,
    addorder, updateorder, deleteorder, deleteUser, getuserbyid, getproductbyid, getorderbyid, getsubcategory,
    getcategorybyid, getsubcategorybyid, getdriverbyid, getdriverbyid, getbannerbyid, allcoupan, deletecoupan, addcoupan,
    getcoupanbyid, updatestatusalluser, updatestatusbanner, updatestatuscategory, updatestatuscoupan, updatestatusdriver, updatestatuspayment,
    updatestatuspolicies, updatestatusposconfig, updatestatusproduct, updatestatusstoredata, updatestatussubcategories,
    getalladmin, getproductbystoreid, getorderbystoreid, getsubcategorybystoreid, updatecoupan, getorderbytype, getstore,
    addmenu,addprivacypolicy,updateprivacypolicy,addsubscriber,updatemenu,updatestatusstore,
    getorderbyuserid,updatestatususer,getpolicybyid,getproductbysidandcid,getproductbysidandscid,
    updateuseraddress,getSubCategorybySidandCid,getpaymentbyid,addContactus
}