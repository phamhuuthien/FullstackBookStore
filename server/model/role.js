const mongoose = require('mongoose');
var roleSchema = new mongoose.Schema({
    roleName:{
        type:String,
        required:true
    }
},{
    timestamps : true
});

module.exports = mongoose.model('Role', roleSchema);
