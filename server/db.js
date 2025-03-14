const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { Schema } = mongoose;
require("dotenv").config();
const mongoUrl = process.env.MONGO_URI;
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('databse connected..'))
    .catch((error) => console.log(error));


const customerSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    phone: {
        type: Number,
        require:true
    }
})

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;  
