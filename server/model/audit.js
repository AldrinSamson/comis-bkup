const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Audit = new Schema ({

    date : { type: Date}, 
    actionType : { type: String},
    actor : { type: String }

},
{
    collection: 'audit'
})

module.exports = mongoose.model('Audit',Audit)