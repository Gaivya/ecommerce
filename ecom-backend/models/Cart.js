// const mongoose = require('mongoose');
// const { Schema } = mongoose;
// const CartSchema = new Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'user'
//     },
//     productId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'product'
//     },
//     quantity: {
//         type: Number
//     }

// }, { timestamps: true })

// module.exports = mongoose.model("cart", CartSchema)


const mongoose = require('mongoose');
const { Schema } = mongoose;

const CartSchema = new Schema({
    userId: {
        type: Number,
        required: true
    },
    cartOrder: [
        {
            cartItemId: {
                type: Number,
                required: true
            },
            product: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            amount: {
                type: Number,
                required: true
            }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("cart", CartSchema);
