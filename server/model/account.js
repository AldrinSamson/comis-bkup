const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Account = new Schema ({

    accountID : { type: String},
    username : { type: String },
    password : { type: String },
    class : { type: String }, 
    firstName : { type: String},
    lastName : { type: String},
    securityAnswer1 : { type: String},
    securityAnswer2 : { type: String}  

},
{
    collection: 'account'
})

module.exports = mongoose.model('Account',Account)