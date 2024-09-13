const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config()

const URL = process.env.MONGO_URL
// console.log('MONGO_URL:', process.env.MONGO_URL);
// process.env.MONGO_URL ||"mongodb://3.108.55.79:27017/GreenFarm"
// 'mongodb://localhost:27017/ecommerce' //process.env.MONGO_URL127.0.0.1
mongoose.set('strictQuery', true)
const connectToMongo = async () => {
    try {
        let db = await mongoose.connect(URL)
        console.log(db.connection.host, "conneted");
    } catch (error) {
        console.log(error, "Failed");
    }

    // const f = await User.find();
    // console.log(f);
}

module.exports = connectToMongo;