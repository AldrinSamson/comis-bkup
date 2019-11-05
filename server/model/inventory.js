const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Inventory = new Schema ({

    itemID: { type: String},
    class: { type: String },
    type: { type: String },
    subType: { type: String },
    itemNum: { type: Number },
    name: { type: String },
    description: { type: String },
    donor :  { type: String },
    location: { type: String },
    condition: { type: String },
    status: {type: String },
    dateAdded: { type: Date },
    dateEdited: { type: Date },
    addedBy: { type: String },
    editedBy: { type: String },
}, 
{
    collection: 'inventory'
})

module.exports = mongoose.model('Inventory',Inventory)