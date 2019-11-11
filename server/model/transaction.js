const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Transaction = new Schema ({
    
    borrowerID : { type: String }, // also bID
    itemID : { type: String },
    purpose : { type: String },
    dateBorrowed : { type: Date },
    dateReturned : { type: Date },
    lentBy : { type: String },
    receivedBy : { type: String },
    hasIncident : { type: Number} 
},
{
    collection: 'transaction'
})

module.exports = mongoose.model('Transaction',Transaction)