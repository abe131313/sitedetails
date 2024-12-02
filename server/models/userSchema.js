const mongoose = require('mongoose');

const userCredentialSchema = new mongoose.Schema({
    username:{type:String, unique:true, required: true},
    password:{type:String, required: true},
})

const userCredential = mongoose.model('UserCredntial',userCredentialSchema);

module.exports = userCredential;
